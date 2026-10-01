import type { TaxSetting } from "../types/TaxSetting";
const API_URL = import.meta.env.VITE_API_URL;

export const getTaxSettingRequest = async () => {
    const response = await fetch(`${API_URL}/settings/tax`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("No se pudo obtener la configuración de impuestos.");
    }
    return response.json() as Promise<TaxSetting>;
}

export const updateTaxSettingRequest = async (dto: TaxSetting, token: string) => {
    const response = await fetch(`${API_URL}/settings/tax`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo actualizar la configuración de impuestos.");
    }
    return response.json() as Promise<TaxSetting>;
}
