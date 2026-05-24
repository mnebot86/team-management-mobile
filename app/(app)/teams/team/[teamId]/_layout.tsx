import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';

export default function TeamStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create-player-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader title="Create New Player" />
          ),
        }}
      />
    </Stack>
  );
}
