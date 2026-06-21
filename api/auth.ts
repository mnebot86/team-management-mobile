import api from './axios';

interface CreateAccountParams {
  email: string;
  password: string;
}

export const createAccount = async ({ email, password }: CreateAccountParams) => {
  const response = await api.post('/auth/register', {
    email,
    password,
  });

  return response.data.data;
};

export const login = async ({ email, password }: CreateAccountParams) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');

  return response.data.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', {
    email,
  });

  return response.data.data;
};

export const resetPassword = async (
  token: string,
  password: string,
) => {
  const response = await api.post('/auth/reset-password',
    {
      token,
      password,
    },
  );

  return response.data;
};
