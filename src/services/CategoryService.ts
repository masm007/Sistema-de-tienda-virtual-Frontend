import type { Category } from "../types/Category";
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