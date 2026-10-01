import type { Category, CreateCategoryDto } from "../types/Category";
const API_URL = import.meta.env.VITE_API_URL;

export const getCategoriesRequest = async () => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        if(response.status === 404){
            throw new Error("Página no encontrada"); 
        }
        throw new Error("Ocurrió un error");
    }
    //return response.json();
    return response.json() as Promise<Category[]>;
}

export const createCategoryRequest = async (dto: CreateCategoryDto, token: string) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo crear la categoría.");
    }
    return response.json() as Promise<Category>;
}

export const updateCategoryRequest = async (dto: Category, token: string) => {
    const response = await fetch(`${API_URL}/categories/${dto.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo actualizar la categoría.");
    }
    return response.json() as Promise<Category>;
}

export const deleteCategoryRequest = async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo eliminar la categoría.");
    }
}