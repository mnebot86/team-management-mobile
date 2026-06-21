import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { TextInput } from 'react-native-paper';

import AppButton from '@/components/ui/Button';
import InputText from '@/components/ui/Input/InputText';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';
import ScreenContainer from '@/components/layout/Screen';
import { forgotPassword } from '@/api/auth';

const ForgetPasswordScreen = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const trimmedEmail = email.trim().toLowerCase();
  const canSubmit = trimmedEmail.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      await forgotPassword(trimmedEmail);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password failed', error);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {isSubmitted ? (
            <View style={styles.confirmationCard}>
              <Text.Subheading>Check your email</Text.Subheading>

              <Text.Body variant="muted" style={styles.confirmationText}>
                If an account exists for {trimmedEmail}, you’ll receive reset instructions shortly.
              </Text.Body>

              <AppButton onPress={() => router.replace('/(auth)/create-account')}>
                Back to Sign In
              </AppButton>
            </View>
          ) : (
            <>
              <InputText
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={(value) => setEmail(value.toLowerCase())}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                left={(
                  <TextInput.Icon
                    icon="email-outline"
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
                Send Reset Link
              </AppButton>

              <View style={styles.signInRow}>
                <Text.Body variant="muted">Remember your password? </Text.Body>
                <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={8}>
                  <Text.Body variant="accent">Sign In</Text.Body>
                </Pressable>
              </View>
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

export default ForgetPasswordScreen;
