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
          header: ({ options, navigation }) => {
            const headerOptions = options as typeof options & {
              headerSubtitle?: string;
              onEditPress?: () => void;
            };

            return (
              <AppHeader
                title={(headerOptions.title as string) ?? 'Player Details'}
                subtitle={headerOptions.headerSubtitle ?? ''}
                onBackPress={() => navigation.goBack()}
                onEditPress={headerOptions.onEditPress}
              />
            );
          },
        }}
      />
    </Stack>
  );
}
