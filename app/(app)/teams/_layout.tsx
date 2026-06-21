import React from 'react';
import { router, Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import AppButton from '@/components/ui/Button';

export default function TeamsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <AppHeader
              title="Teams"
              subtitle="Manage your teams"
              headerContent={(
                <AppButton
                  icon="plus"
                  variant='header'
                  fullWidth={false}
                  onPress={() => {
                    router.push('/(app)/teams/create-team-modal');
                  }}
                >
                  New Team
                </AppButton>
              )}
            />
          ),
        }}
      />

      <Stack.Screen
        name="team/[teamId]"
        options={{
          headerShown: false,
          header: ({ options, navigation }) => (
            <AppHeader
              title={(options.title as string) ?? 'Team'}
              subtitle={(options as any).headerSubtitle ?? ''}
              onBackPress={() => navigation.goBack()}
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
