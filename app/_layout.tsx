import { Provider as PaperProvider } from 'react-native-paper';
import { router, Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useStoredToken } from '@/hooks/useStoredToken';
import { lightTheme, darkTheme } from '@/themes/theme';
import { getMe } from '@/api/auth';
import AppSnackbar from '@/components/ui/SnackBar';
import * as SecureToken from 'expo-secure-store';
import { connectSocket, disconnectSocket } from '@/socket/service';

export default function RootLayout() {
  const scheme = useColorScheme();
  const {
    setHydrated,
    setAuth,
    setProfile,
    isHydrated,
    token,
  } = useSessionStore();

  const { removeToken } = useStoredToken();

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  useEffect(() => {
    const init = async () => {
      const storedToken = await SecureToken.getItemAsync('token');

      if (!storedToken) {
        setHydrated();
        return;
      }

      try {
        const session = await getMe();
        const user = session?.user ?? session;
        const profile = session?.profile ?? null;

        if (user && typeof user === 'object') {
          setAuth(user, storedToken);
        }

        if (profile && typeof profile === 'object') {
          setProfile(profile);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const message = err?.message ?? '';

        if (
          status === 401 ||
          message.toLowerCase().includes('token') ||
          message.toLowerCase().includes('jwt')
        ) {
          await removeToken();
          return;
        }

        setSnackbar({
          visible: true,
          message: message || 'Session restore failed',
        });
      } finally {
        setHydrated();
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;

    if (!socketUrl) {
      setSnackbar({
        visible: true,
        message: 'Socket URL is not configured',
      });
      return;
    }

    connectSocket(socketUrl, token);

    return () => disconnectSocket();
  }, [token]);

  useEffect(() => {
    if (
      isHydrated &&
      !token &&
      !inAuthGroup
    ) {
      router.replace('/(auth)/login');
    }

  }, [isHydrated, token, inAuthGroup]);

  if (!isHydrated) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style={scheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.colors.background}
      />

      <Slot />

      <AppSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </AppSnackbar>
    </PaperProvider>
  );
}
