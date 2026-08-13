import type { Order, OrderSummary, CreateOrderDto } from "../types/Order";
const API_URL = import.meta.env.VITE_API_URL;

export const getAllOrdersForAdmin = async (token: string) => {
    const response = await fetch(`${API_URL}/orders/admin/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    return response.json() as Promise<OrderSummary[]>;
}

export const getOrderByOrderNumberForAdmin = async (orderNumber: string, token: string) => {
    const response = await fetch(`${API_URL}/orders/admin/${orderNumber}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    return response.json() as Promise<Order>;
}

export const getOrderByOrderNumberForUser = async (orderNumber: string, token: string) => {
    const response = await fetch(`${API_URL}/orders/${orderNumber}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        //no es necesario enviar la cookie
        //credentials: "include",
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    return response.json() as Promise<Order>;
}

export const getAllOrdersForUser = async (token: string) => {
    const response = await fetch(`${API_URL}/orders/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    return response.json() as Promise<OrderSummary[]>;
}

export const createOrder = async (dto: CreateOrderDto, token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            //requiere de este header para ASP.NET sepa que el body contiene JSON
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Asegurese de que hayan productos agregados en su carrito.");
        }
        if (response.status === 401) {
            throw new Error("No autorizado.");
        }
        throw new Error("No se pudo realizar la orden.");
    }
    return response.json() as Promise<Order>;
}
