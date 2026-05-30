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

      <Stack.Screen
        name="player/[playerId]"
        options={{
          header: ({ options, navigation }) => (
            <AppHeader
              title={(options.title as string) ?? 'Player Details'}
              subtitle={(options as any).headerSubtitle ?? ''}
              onBackPress={() => navigation.goBack()}
            />
          ),
        }}
      />
    </Stack>
  );
}
