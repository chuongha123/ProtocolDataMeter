import { api } from "./axiosInterceptor";
import { LoginRequest, JWTToken, RegisterRequest, RegisterResponse } from "./types/auth";

const API_URL = "/api/auth";

export const authService = {
  login: async (request: LoginRequest): Promise<JWTToken> => {
    const response = await api.post(`${API_URL}/login`, request);
    return response.data;
  },
  register: async (request: RegisterRequest): Promise<void> => {
    await api.post(`${API_URL}/register`, request);
  },
};
