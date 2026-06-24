import React from 'react';
import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create-account"
        options={{
          header: ({ navigation }) => (
            <AppHeader
              title="Create Account"
              subtitle="Join your team management platform"
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forget-password" options={{
        header: ({ navigation }) => (
          <AppHeader
            title="Forget Password"
            subtitle="Enter your email to receive a reset link"
            onBackPress={() => navigation.goBack()}
          />
        ),
      }} />
      <Stack.Screen name="reset-password" options={{
        header: ({ navigation }) => (
          <AppHeader
            title="Reset Password"
            subtitle="Enter your new password"
            onBackPress={() => navigation.replace('login')}
          />
        ),
      }} />
    </Stack>
  );
}
