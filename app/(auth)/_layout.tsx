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
      <Stack.Screen
        name="create-profile"
        options={{
          header: () => (
            <AppHeader
              title="Create Profile"
              subtitle="Tell us about yourself"
            />
          ),
        }}
      />
    </Stack>
  );
}
