import { axiosClient } from './axiosClient';
import {
  ApiSuccessResponse,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  User,
} from '../types/auth';

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponseData> {
  const response = await axiosClient.post<ApiSuccessResponse<AuthResponseData>>(
    '/auth/register',
    payload,
  );
  return response.data.data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponseData> {
  const response = await axiosClient.post<ApiSuccessResponse<AuthResponseData>>(
    '/auth/login',
    payload,
  );
  return response.data.data;
}

export async function logoutRequest(): Promise<void> {
  await axiosClient.post('/auth/logout');
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await axiosClient.get<ApiSuccessResponse<{ user: User }>>('/auth/me');
  return response.data.data.user;
}