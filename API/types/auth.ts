export interface LoginRequest {
  username: string;
  password: string;
}

export interface JWTToken {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}
