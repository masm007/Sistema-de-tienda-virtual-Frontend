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

export const UserRole = {
  User: 0,
  Admin: 1,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];