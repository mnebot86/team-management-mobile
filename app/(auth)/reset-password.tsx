import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput } from 'react-native-paper';

import AppButton from '@/components/ui/Button';
import InputText from '@/components/ui/Input/InputText';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';
import ScreenContainer from '@/components/layout/Screen';
import { resetPassword } from '@/api/auth';

const ResetPasswordScreen = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canSubmit = password.length >= 8 && password === confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit || !token) {
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Reset password failed', error);
    }
  };

  if (!token) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text.Subheading>Invalid Reset Link</Text.Subheading>
          <Text.Body variant="muted">
            This password reset link is invalid or has expired.
          </Text.Body>

          <AppButton onPress={() => router.replace('/(auth)/login')}>
            Go to Sign In
          </AppButton>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {isSubmitted ? (
            <View style={styles.confirmationCard}>
              <Text.Subheading>Password Updated</Text.Subheading>

              <Text.Body variant="muted" style={styles.confirmationText}>
                Your password has been successfully updated. You can now sign in with your new password.
              </Text.Body>

              <AppButton onPress={() => router.replace('/(auth)/login')}>
                Go to Sign In
              </AppButton>
            </View>
          ) : (
            <>
              <InputText
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="newPassword"
                left={(
                  <TextInput.Icon
                    icon="lock-outline"
                    color={theme.colors.icon.secondary}
                  />
                )}
              />

              <InputText
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                textContentType="newPassword"
                left={(
                  <TextInput.Icon
                    icon="lock-check-outline"
                    color={theme.colors.icon.secondary}
                  />
                )}
              />

              <AppButton
                onPress={() => {
                  void handleSubmit();
                }}
                variant='secondary'
                disabled={!canSubmit}
                style={styles.submitButton}
                rounded
              >
                Reset Password
              </AppButton>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.auth.headerBackground,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 52,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: 40,
    },
    backIcon: {
      color: colors.auth.headerText,
      fontSize: 40,
      lineHeight: 44,
    },
    headerTitle: {
      color: colors.auth.headerText,
      fontSize: 40,
      lineHeight: 48,
      marginBottom: 16,
    },
    headerSubtitle: {
      color: colors.auth.headerSubtitle,
      fontSize: 20,
      lineHeight: 28,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
      gap: 24,
    },
    submitButton: {
      marginTop: 8,
    },
    signInRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 28,
      flexWrap: 'wrap',
    },
    confirmationCard: {
      backgroundColor: colors.card.background,
      borderColor: colors.card.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
      gap: 16,
    },
    confirmationText: {
      lineHeight: 24,
    },
  });

export default ResetPasswordScreen;
