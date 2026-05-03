import React from 'react';
import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function OnboardingLayout() {
  return (
    <Stack>
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
      <Stack.Screen
        name="welcome"
        options={{
          header: () => (
            <AppHeader
              title="welcome"
              subtitle="Get started by creating or joining a team"
            />
          ),
        }}
      />
    </Stack>
  );
}
