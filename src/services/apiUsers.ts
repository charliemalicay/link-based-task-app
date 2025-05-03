import axios from "axios";

// const API_URL = "http://localhost:3000/users/login";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}users`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}


export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    userId: string;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, data);
        console.log("Login successful:", response.data);

        // @ts-ignore
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
}


export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    try {
        const response = await axios.post<RegisterResponse>(`${API_URL}/register`, data);
        console.log("Registration successful:", `${API_URL}register`, response.data);

        // @ts-ignore
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }
}


