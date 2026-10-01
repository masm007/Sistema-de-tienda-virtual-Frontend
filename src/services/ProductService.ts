import type { CreateProductDto, Product, ProductRequest, UpdateProductDto } from "../types/Product";
const API_URL = import.meta.env.VITE_API_URL;

export const getAllProductsRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/products/admin`, {
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
    //return response.json();
    return response.json() as Promise<Product[]>;
}

export const getAllActivesProductsRequest = async () => {
    const response = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    //return response.json();
    return response.json() as Promise<ProductRequest[]>;
}

export const getProductById = async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
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
    //return response.json();
    return response.json() as Promise<Product>;
}

export const createProductRequest = async (dto: CreateProductDto, token: string) => {
    const formData = new FormData();
    formData.append("Name", dto.name);
    formData.append("Description", dto.description);
    formData.append("CategoryId", String(dto.categoryId));
    formData.append("Price", String(dto.price));
    formData.append("Sku", dto.sku);
    formData.append("Quantity", String(dto.quantity));
    dto.images.forEach((file) => formData.append("Images", file));

    // Sin Content-Type: el navegador lo define con el boundary del multipart
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo crear el producto.");
    }
    return response.json() as Promise<{ id: number; name: string }>;
}

export const updateProductRequest = async (dto: UpdateProductDto, token: string) => {
    const formData = new FormData();
    formData.append("Name", dto.name);
    formData.append("Description", dto.description);
    formData.append("CategoryId", String(dto.categoryId));
    formData.append("Price", String(dto.price));
    formData.append("Sku", dto.sku);
    formData.append("Quantity", String(dto.quantity));
    formData.append("IsAvailable", String(dto.isAvailable));
    formData.append("IsActive", String(dto.isActive));
    dto.keepImageIds.forEach((id) => formData.append("KeepImageIds", String(id)));
    dto.newImages.forEach((file) => formData.append("NewImages", file));

    // Sin Content-Type: el navegador lo define con el boundary del multipart
    const response = await fetch(`${API_URL}/products/${dto.id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo actualizar el producto.");
    }
    return response.json() as Promise<{ id: number; name: string }>;
}

export const getProductBySku = async (sku: string) => {
    const response = await fetch(`${API_URL}/products/${sku}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Página no encontrada");
        }
        throw new Error("Ocurrió un error");
    }
    //return response.json();
    return response.json() as Promise<ProductRequest>;
}