import type { AdminUserDto, EditUserDto } from "../types/User";
const API_URL = import.meta.env.VITE_API_URL;

export const getAllUsersRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("No autorizado para ver los usuarios.");
        }
        throw new Error("No se pudieron obtener los usuarios.");
    }
    return response.json() as Promise<AdminUserDto[]>;
}

export const deleteUserRequest = async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo eliminar el usuario.");
    }
}

export const getMyProfileRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("No se pudo obtener tu perfil.");
    }
    return response.json() as Promise<AdminUserDto>;
}

export const updateMyProfileRequest = async (dto: EditUserDto, token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo actualizar tu perfil.");
    }
    return response.json() as Promise<AdminUserDto>;
}

export const deleteMyAccountRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo eliminar tu cuenta.");
    }
}
