import { View, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import Button from '@/components/ui/Button';
import { router } from 'expo-router';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import AppIcon from '@/components/AppIcon';
import { useTheme } from 'react-native-paper';
import { useCallback, useMemo, useState } from 'react';
import { login } from '@/api/auth';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useStoredToken } from '@/hooks/useStoredToken';
import SnackBar from '@/components/ui/SnackBar';

const Login = () => {
  const theme = useTheme();
  const { setAuth } = useSessionStore();
  const { saveToken } = useStoredToken();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const disabled = useMemo(() => {
    return loading || !email.trim() || !password.trim();
  }, [loading, email, password]);

  const handleLogin = useCallback(async () => {
    const payload = { email, password };

    try {
      setLoading(true);

      const { token, user } = await login(payload);

      await saveToken(token);
      setAuth(user, token);

      // router.push('/(app)/dashboard'); hide while in development
      router.push('/(app)/teams');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';

      setError(message);

      setSnackbar({
        visible: true,
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  return (
    <ScreenContainer.Centered>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: theme.colors.elevation?.level2 ?? theme.colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <AppIcon name="account-outline" variant="accent" size={38} />
      </View>

      <Text.Heading style={{ marginBottom: 8 }}>
        Welcome Back
      </Text.Heading>

      <Text.Muted style={{ marginBottom: 24 }}>
        Sign in to continue
      </Text.Muted>

      <Input.Text
        label="Email"
        placeholder="you@example.com"
        left={<TextInput.Icon icon="email-outline" />}
        autoCapitalize='none'
        style={{ marginBottom: 16 }}
        onChangeText={(text) => {
          setEmail(text);

          if (error) setError(null);
        }}
      />

      <Input.Text
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        left={<TextInput.Icon icon="lock-outline" />}
        style={{ marginBottom: 8 }}
        onChangeText={(text) => {
          setPassword(text);

          if (error) setError(null);
        }}
      />

      <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 24 }}>
        <Pressable onPress={() => router.push('/(auth)/forget-password')}>
          <Text.Body variant="accent">
            Forgot Password?
          </Text.Body>
        </Pressable>
      </View>

      <Button onPress={handleLogin} disabled={disabled} variant='secondary'>
        Sign In
      </Button>

      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <Text.Muted>Don't have an account? </Text.Muted>

        <Pressable onPress={() => router.push('/(auth)/create-account')}>
          <Text.Body variant="accent">
            Create Account
          </Text.Body>
        </Pressable>
      </View>

      <SnackBar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </SnackBar>
    </ScreenContainer.Centered>
  );
};

export default Login;
