import type { Product } from "../types/Product";
const API_URL = import.meta.env.VITE_API_URL;

export const getProductsRequest = async () => {
    const response = await fetch(`${API_URL}/products`, {
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
    return response.json() as Promise<Product[]>;
}