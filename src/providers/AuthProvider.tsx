import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "../constants/storage";
import {
  loginRequest,
  logoutRequest,
  refreshRequest,
} from "../services/AuthService";
import { UserRole, type User } from "../types/User";
import { useNotification } from "../hooks/useNotification";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  // Refleja localmente los datos que ya guardó el backend tras editar el perfil,
  // sin gastar una rotación de refresh token solo para sincronizar el nombre/email.
  updateProfile: (firstName: string, lastName: string, email: string) => void;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Se renueva el access token este tiempo antes de que expire
const REFRESH_MARGIN_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: Props) => {
  const { success, error, warning } = useNotification();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const isAdmin = user?.role === UserRole.Admin;
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const authenticate = (user: User) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, user.accessToken);
    setUser(user);
    setToken(user.accessToken);
    setIsAuthenticated(true);
  };

  const clear = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginRequest(email, password);
      authenticate(user);
      success("Inicio de sesión exitoso", "Inicio de sesión");
    } catch (err) {
      if (err instanceof Error) {
        error(err.message, "Inicio de sesión");
      } else {
        error("Ocurrió un error inesperado", "Inicio de sesión");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await logoutRequest(token);
        success("El cierre de sesión ha sido exitoso", "Cierre de sesión");
      }
    } catch (err) {
      if (err instanceof Error) {
        warning(
          "La sesión local se cerró, pero no se pudo notificar al servidor.",
          "Cerrar sesión",
        );
      }
    } finally {
      clear();
      setLoading(false);
    }
  };

  // Una sola petición en curso: el backend rota el refresh token, así que dos
  // refresh simultáneos con la misma cookie se leen como reutilización y cierran la sesión.
  // "silent" renueva sin activar loading para no desmontar la pantalla actual.
  const refresh = (silent = false): Promise<void> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;
    const run = async () => {
      if (!silent) setLoading(true);
      try {
        authenticate(await refreshRequest());
      } catch {
        clear();
        if (silent) {
          warning(
            "Tu sesión expiró. Inicia sesión nuevamente.",
            "Sesión expirada",
          );
        }
      } finally {
        if (!silent) setLoading(false);
        refreshPromiseRef.current = null;
      }
    };
    refreshPromiseRef.current = run();
    return refreshPromiseRef.current;
  };

  const updateProfile = (firstName: string, lastName: string, email: string) => {
    setUser((current) => (current ? { ...current, firstName, lastName, email } : current));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) return;
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const delay = Math.max(
      expiry - Date.now() - REFRESH_MARGIN_MS,
      MIN_REFRESH_DELAY_MS,
    );
    const timer = setTimeout(() => refresh(true), delay);

    // Los timers se retrasan en pestañas en segundo plano o tras suspender el equipo
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() >= expiry - REFRESH_MARGIN_MS
      ) {
        refresh(true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {/* */}
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated,
          isAdmin,
          loading,
          login,
          logout,
          refresh,
          updateProfile,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
