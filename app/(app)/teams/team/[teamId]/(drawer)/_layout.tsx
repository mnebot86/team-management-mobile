import AppHeader from '@/components/AppHeader';
import { Drawer } from 'expo-router/drawer';

export default function TeamDashboardLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Dashboard',
          header: ({ options, navigation }) => (
            <AppHeader
              title={(options.title as string) ?? 'Team'}
              subtitle={(options as any).headerSubtitle ?? ''}
              onBackPress={() => navigation.goBack()}
              onMenuPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="roster"
        options={{
          drawerLabel: 'Roster',
          header: ({ navigation }) => (
            <AppHeader
              title='Roster'
              subtitle='Manager your players'
              onMenuPress={() => navigation.toggleDrawer()}
            />
          ),
        }}
      />
    </Drawer>
  );
}
