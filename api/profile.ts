import api from './axios';

interface CreateProfileParams {
  firstName: string;
  lastName: string;
  avatar?: {
    uri: string;
    name: string;
    type: string;
  };
}

export const userCreateProfile = async ({
  firstName,
  lastName,
  avatar,
}: CreateProfileParams) => {
  const formData = new FormData();

  formData.append('firstName', firstName);
  formData.append('lastName', lastName);

  if (avatar) {
    formData.append('avatar', {
      uri: avatar.uri,
      name: avatar.name,
      type: avatar.type,
    } as any);
  }

  const response = await api.post('/profiles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
