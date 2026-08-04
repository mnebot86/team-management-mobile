import AppHeader from '@/components/AppHeader';
import AppIcon from '@/components/AppIcon';
import { getTabBarOptions } from '@/constants/navigationTheme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useSessionStore } from '@/hooks/useSessionStore';
import { getSocket } from '@/socket/service';
import { Badge } from 'react-native-paper';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNotificationStore } from '@/hooks/useNotification';

export default function AuthLayout() {
  const theme = useAppTheme();

  const { profile } = useSessionStore();

  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    if (!profile?._id) {
      return;
    }

    try {
      const socket = getSocket();

      socket.emit('join', profile._id);
    } catch (error) {
      console.warn('Socket has not been initialized.');
    }
  }, [profile?._id]);

  return (
    <Tabs screenOptions={{ ...getTabBarOptions(theme) }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          href: null,
          header: () => (
            <AppHeader
              title="Home"
              subtitle="Welcome back, Coach!"
            />
          ),
          tabBarIcon: ({ size }: { size: number }) => (
            <AppIcon
              name="view-dashboard-outline"
              size={size}
              variant="default"
            />
          ),
          tabBarLabel: 'Dashboard',
        }}
      />

      <Tabs.Screen
        name="teams"
        options={{
          headerShown: false,
          tabBarIcon: ({ size }: { size: number }) => (
            <AppIcon
              name="account-group-outline"
              size={size}
              variant="default"
            />
          ),
          tabBarLabel: 'Teams',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          header: () => (
            <AppHeader
              title="Settings"
              subtitle="Manage your account"
            />
          ),
          tabBarIcon: ({ size }: { size: number }) => (
            <AppIcon
              name="cog-outline"
              size={size}
              variant="default"
            />
          ),
          tabBarLabel: 'Settings',
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          header: () => (
            <AppHeader
              title="Notifications"
              subtitle="Manage your notifications"
            />
          ),
          tabBarIcon: ({ size }: { size: number }) => (
            <View style={styles.iconContainer}>
              <AppIcon
                name="bell-outline"
                size={size}
                variant="default"
              />

              {unreadCount > 0 && (
                <Badge
                  size={18}
                  style={styles.badge}
                >
                  {unreadCount > 99
                    ? '99+'
                    : unreadCount}
                </Badge>
              )}
            </View>
          ),
          tabBarLabel: 'Notifications',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
});
