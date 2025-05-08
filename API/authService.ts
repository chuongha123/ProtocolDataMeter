import { api } from './axiosInterceptor';
import { JWTToken, LoginRequest, RegisterRequest, UserProfile } from './types/auth';

const API_URL = "/api/auth";

export const authService = {
  login: async (request: LoginRequest): Promise<JWTToken> => {
    return await api.post(`${API_URL}/login`, request);
  },
  register: async (request: RegisterRequest): Promise<void> => {
    await api.post(`${API_URL}/register`, request);
  },
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await api.get(`${API_URL}/profile`);
    return response.data;
  },
};
