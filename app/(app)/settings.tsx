import React, { useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { View } from 'react-native';
import Button from '@/components/ui/Button';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useStoredToken } from '@/hooks/useStoredToken';
import {
  router

} from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';

const Settings = () => {
  const { logout } = useSessionStore();
  const { removeToken } = useStoredToken();
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const handleLogout = async () => {
    try {
      await removeToken();
      logout();
      router.replace('/(auth)/login');
    } catch (err: any) {
      const message = err?.message || 'Unable to logout. Please try again.';

      setSnackbar({
        visible: true,
        message,
      });
    }
  };

  return (
    <ScreenContainer>
      <View style={{ padding: 16, gap: 12 }}>
        <Text.Caption
          style={{
            opacity: 0.6,
            marginBottom: 6,
            fontSize: 15,
            letterSpacing: 0.5,
            fontWeight: 'bold'
          }}
        >
          Actions
        </Text.Caption>

        <View style={{ marginTop: 4 }}>
          <Button
            variant="danger"
            icon="logout"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </View>
      </View>
      <AppSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

export default Settings;
