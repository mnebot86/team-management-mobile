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
        name="player/[playerId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create-schedule-modal"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Create Schedule Event"
            />
          ),
        }}
      />

      <Stack.Screen
        name="pick-date-modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 1,
          header: () => (
            <AppHeader
              title="Pick Date"
            />
          ),
        }}
      />
    </Stack>
  );
}
