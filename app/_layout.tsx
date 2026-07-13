import { Provider as PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useStoredToken } from '@/hooks/useStoredToken';
import { lightTheme, darkTheme } from '@/themes/theme';
import { getMe } from '@/api/auth';
import AppSnackbar from '@/components/ui/SnackBar';
import * as SecureToken from 'expo-secure-store';
import { connectSocket } from '@/socket/service';

export default function RootLayout() {
  const scheme = useColorScheme();
  const { setHydrated, setAuth, setProfile, isHydrated } = useSessionStore();
  const { removeToken } = useStoredToken();

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(() => {
    const init = async () => {
      const token = await SecureToken.getItemAsync('token');

      if (!token) {
        setHydrated();
        return;
      }

      try {
        const { user, profile } = await getMe();

        setAuth(user, token);

        connectSocket(process.env.EXPO_PUBLIC_SOCKET_URL!, token);

        if (profile) {
          setProfile(profile);
        }
      } catch (err: any) {
        const message = err?.message || 'Session restore failed';

        setSnackbar({
          visible: true,
          message,
        });

        if (err?.response?.status === 401) {
          await removeToken();
        }
      } finally {
        setHydrated();
      }
    };

    init();
  }, [setAuth, setProfile, setHydrated]);

  if (!isHydrated) return null;

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
