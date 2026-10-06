import api from './axios';
import type { ApiProfile, ApiResponse, ApiUser } from './types';

interface CreateAccountParams {
  email: string;
  password: string;
}

export interface AuthSession {
  user: ApiUser;
  token: string;
}

export interface RestoredSession {
  user: ApiUser;
  profile: ApiProfile;
}

export const createAccount = async ({ email, password }: CreateAccountParams): Promise<AuthSession> => {
  const response = await api.post<ApiResponse<AuthSession>>('/auth/register', {
    email,
    password,
  });

  return response.data.data;
};

export const login = async ({ email, password }: CreateAccountParams): Promise<AuthSession> => {
  const response = await api.post<ApiResponse<AuthSession>>('/auth/login', {
    email,
    password,
  });

  return response.data.data;
};

export const getMe = async (): Promise<RestoredSession> => {
  const response = await api.get<ApiResponse<RestoredSession>>('/auth/me');

  return response.data.data;
};

export const forgotPassword = async (email: string): Promise<null> => {
  const response = await api.post<ApiResponse<null>>('/auth/forgot-password', {
    email,
  });

  return response.data.data;
};

export const resetPassword = async (
  token: string,
  password: string,
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/auth/reset-password',
    {
      token,
      password,
    },
  );

  return response.data;
};
