export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiUser {
  _id: string;
  email: string;
}

export interface ApiProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface ReactNativeFormDataFile {
  uri: string;
  name: string;
  type: string;
}

declare global {
  interface FormData {
    append(name: string, value: string | Blob | ReactNativeFormDataFile): void;
  }
}
