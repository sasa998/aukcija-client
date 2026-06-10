import { api } from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data.user;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.get(`/auth/verify-email?token=${token}`);
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
