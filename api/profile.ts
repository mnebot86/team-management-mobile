import api from './axios';
import type { ApiProfile, ApiResponse, ReactNativeFormDataFile } from './types';

interface CreateProfileParams {
  firstName: string;
  lastName: string;
  avatar?: ReactNativeFormDataFile;
}

export const userCreateProfile = async ({
  firstName,
  lastName,
  avatar,
}: CreateProfileParams): Promise<ApiProfile> => {
  const formData = new FormData();

  formData.append('firstName', firstName);
  formData.append('lastName', lastName);

  if (avatar) {
    formData.append('avatar', {
      uri: avatar.uri,
      name: avatar.name,
      type: avatar.type,
    });
  }

  const response = await api.post<ApiResponse<ApiProfile>>('/profiles', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
