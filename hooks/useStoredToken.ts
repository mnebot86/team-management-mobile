import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

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

  const saveToken = useCallback(async (newToken: string) => {
    await SecureStore.setItemAsync('token', newToken);
    setToken(newToken);
  }, []);

  const removeToken = useCallback(async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  }, []);

  return {
    token,
    loading,
    saveToken,
    removeToken,
  };
};
