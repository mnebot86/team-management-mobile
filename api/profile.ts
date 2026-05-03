import api from './axios';

interface CreateProfileParams {
  firstName: string;
  lastName: string;
};

export const userCreateProfile = async ({ firstName, lastName }: CreateProfileParams) => {
  const response = await api.post('/profiles', {
    firstName,
    lastName,
  });

  return response.data.data;
};
