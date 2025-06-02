export interface AuthRegisterLoginRequest {
    email: string;
    password: string;
    userRole?: string; // make role optional
}