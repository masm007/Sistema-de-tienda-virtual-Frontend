import { createContext, useEffect, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../constants/storage";
import {
  loginRequest,
  logoutRequest,
  refreshRequest,
} from "../services/AuthService";
import type { User } from "../types/User";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    refresh();
  }, []);

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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch (error) {
      console.log("Ocurrio un error al cerrar sesion");
    } finally {
      clear();
      setLoading(false);
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const user = await refreshRequest();
      authenticate(user);
    } catch (error) {
      console.log("Ocurrio un error al refrescar la sesion");
      clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* */}
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated,
          loading,
          login,
          logout,
          refresh,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
