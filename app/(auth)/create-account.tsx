import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SnackBar from '@/components/ui/SnackBar';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createAccount } from '@/api/auth';
import { useStoredToken } from '@/hooks/useStoredToken';
import { useSessionStore } from '@/hooks/useSessionStore';

const CreateAccount = () => {
  const { saveToken } = useStoredToken();
  const { setAuth } = useSessionStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: '' });

  const isDisabled = useMemo(() => {
    const missingInputs = !email || !password || !confirmPassword;
    return missingInputs || error || loading;
  }, [email, password, confirmPassword, error, loading]);

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setError(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    const payload = {
      email,
      password,
    };

    if (password !== confirmPassword) {
      setError(true);
      setSnack({ visible: true, message: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);

      const { token, user } = await createAccount(payload);

      saveToken(token);
      setAuth(user, token);

      router.push('/(onboarding)/create-profile');
    } catch (err: any) {
      const message = err?.message || 'Something went wrong. Please try again.';

      setSnack({ visible: true, message });
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword]);

  return (
    <ScreenContainer>
      <View style={{ padding: 16 }}>
        <Input.Text
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 16 }}
        />

        <Input.Text
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ marginBottom: 4 }}
        />

        <Text.Body variant="muted" style={{ marginBottom: 16 }}>
          Must be at least 8 characters
        </Text.Body>

        <Input.Text
          label="Confirm Password"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{ marginBottom: 24 }}
        />

        <Button
          variant='secondary'
          disabled={isDisabled}
          onPress={handleSubmit}>
          Continue
        </Button>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Text.Body variant="muted">
            Already have an account?{' '}
          </Text.Body>

          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text.Body variant="accent">Sign In</Text.Body>
          </Pressable>
        </View>
      </View>

      <SnackBar
        visible={snack.visible}
        onDismiss={() => setSnack({ ...snack, visible: false })}
        variant="error"
        duration={3000}
      >
        {snack.message}
      </SnackBar>
    </ScreenContainer>
  );
};

export default CreateAccount;
