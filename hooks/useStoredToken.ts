import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export const useStoredToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await SecureStore.getItemAsync('token');

      setToken(stored);
      setLoading(false);
    };

    load();
  }, []);

  const saveToken = async (newToken: string) => {
    await SecureStore.setItemAsync('token', newToken);
    setToken(newToken);
  };

  const removeToken = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  };

  return {
    token,
    loading,
    saveToken,
    removeToken,
  };
};
