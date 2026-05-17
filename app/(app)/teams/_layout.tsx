import AppIcon from '@/components/AppIcon';
import React from 'react';
import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function TeamLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <AppHeader
              title="Teams"
              subtitle="Manage your teams"
            />
          ),
        }}
      />

      <Stack.Screen
        name="create-team-modal"
        options={{
          header: () => (
            <AppHeader
              title="Create Team"
            />
          ),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
