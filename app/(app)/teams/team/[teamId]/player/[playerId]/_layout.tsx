import AppHeader from '@/components/AppHeader';
import { Stack } from 'expo-router';

export default function TeamStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit"
        options={{
          presentation: 'modal',
          header: () => (
            <AppHeader
              title="Edit Player"
            />
          ),
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          header: ({ options, navigation }) => (
            <AppHeader
              title={(options.title as string) ?? 'Player Details'}
              subtitle={(options as any).headerSubtitle ?? ''}
              onBackPress={() => navigation.goBack()}
              onEditPress={(options as any).onEditPress}
            />
          ),
        }}
      />
    </Stack>
  );
}
