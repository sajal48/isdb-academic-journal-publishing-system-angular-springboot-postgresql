export interface UserRegisterResponse {
    id: BigInteger;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: Date;
}