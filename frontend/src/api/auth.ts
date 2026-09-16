// src/api/auth.ts
import { api } from './axios';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  phone?: string;
}

export const login = (email: string, password: string) =>
  api
    .post<AuthResponse>('/auth/login', { email, password })
    .then((r) => r.data);

export const register = (data: RegisterInput) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const getMe = () =>
  api.get<AuthUser>('/auth/me').then((r) => r.data);

/* -------------------- Redefinição de senha -------------------- */

export const forgotPassword = (email: string) =>
  api
    .post<{ message: string }>('/auth/forgot-password', { email })
    .then((r) => r.data);

export const resetPassword = (token: string, password: string) =>
  api
    .post<{ message: string }>('/auth/reset-password', { token, password })
    .then((r) => r.data);