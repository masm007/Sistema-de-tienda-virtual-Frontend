export interface User {
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    accessToken: string
}

export interface UserDto {
    firstName: string,
    lastName: string,
    email: string,
}

// Misma forma que UserResponseDto del backend: la usan tanto el admin al listar
// usuarios (GET /users, GET /users/{id}) como el propio usuario en su perfil (GET /users/me)
export interface AdminUserDto {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
}

export interface EditUserDto {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    // vacío u omitido = no cambiar la contraseña
    password?: string,
}

export const UserRole = {
  User: 0,
  Admin: 1,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];