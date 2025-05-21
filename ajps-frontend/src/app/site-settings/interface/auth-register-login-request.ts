export interface AuthRegisterLoginRequest {
    email: string;
    password: string;
    role?: string; // make role optional
}