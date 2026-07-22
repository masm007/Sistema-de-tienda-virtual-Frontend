const API_URL = import.meta.env.VITE_API_URL;

export const loginRequest = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            Email: email,
            Password: password
        }),
    });
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Credenciales incorrectas");
        }
        throw new Error("Error al iniciar sesión");
    }
    return response.json();
}

export const signUpRequest = async (firstname: string, lastname: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            FirstName: firstname,
            LastName: lastname,
            Email: email,
            Password: password,
        }),
    });
    if (!response.ok) {
        throw new Error("Error al registrar el cliente");
    }
    return response.json();
}

export const logoutRequest = async (token: string) => {
    const response = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error al cerrar sesión");
    }
};

export const refreshRequest = async () => {
    console.log("Llamando a refresh");
    const response = await fetch(`${API_URL}/users/refresh`, {
        method: "POST",
        //envia la cookie
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("No se pudo renovar la sesión");
    }
    return response.json();
};
