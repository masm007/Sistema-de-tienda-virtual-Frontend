import type {
  CreateCouponDto,
  CouponDto,
  ValidateCouponRequest,
  ApplyCouponResultDto,
} from "../types/Coupon";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCouponsRequest = async (token: string) => {
  const response = await fetch(`${API_URL}/coupons`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("No autorizado para ver los cupones.");
    }
    throw new Error("No se pudieron obtener los cupones.");
  }
  return response.json() as Promise<CouponDto[]>;
};

export const createCouponRequest = async (
  dto: CreateCouponDto,
  token: string,
) => {
  const response = await fetch(`${API_URL}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const message = await extractErrorMessage(response, "No se pudo crear el cupón.");
    throw new Error(message);
  }
  return response.json() as Promise<CouponDto>;
};

// Este es el que usás en el TextField de cupón del Cart
export const validateCouponRequest = async (
  dto: ValidateCouponRequest,
  token: string,
) => {
  const response = await fetch(`${API_URL}/coupons/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "El cupón no es válido para tu carrito.",
    );
    throw new Error(message);
  }
  return response.json() as Promise<ApplyCouponResultDto>;
};

export const deactivateCouponRequest = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/coupons/${id}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Cupón no encontrado.");
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("No autorizado para desactivar cupones.");
    }
    throw new Error("No se pudo desactivar el cupón.");
  }
};

// Ambos endpoints admin (create/validate) devuelven { error: "..." } en 400
// con mensajes específicos de ArgumentException/InvalidOperationException,
// así que los leemos en vez de mostrar un mensaje genérico.
async function extractErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data?.error ?? fallback;
  } catch {
    return fallback;
  }
}