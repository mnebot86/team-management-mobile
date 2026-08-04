import AppHeader from '@/components/AppHeader';
import AppIcon from '@/components/AppIcon';
import { getTabBarOptions } from '@/constants/navigationTheme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useSessionStore } from '@/hooks/useSessionStore';
import { connectSocket } from '@/socket/service';
import { Badge } from 'react-native-paper';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNotificationStore } from '@/hooks/useNotification';
import { getNotifications, getUnreadNotificationCount } from '@/api/notification';
import { Notification } from '@/hooks/useNotification';

export default function AuthLayout() {
  const theme = useAppTheme();

  const { profile, token } = useSessionStore();

  const {
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    setNotifications,
    setUnreadCount,
  } = useNotificationStore();

  useEffect(() => {
    const socketUrl = process.env.EXPO_PUBLIC_SOCKET_URL;

    if (!profile?._id || !token || !socketUrl) {
      return;
    }

    try {
      const socket = connectSocket(socketUrl, token);

      const hydrateNotifications = async () => {
        const [notifications, count] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ]);

        setNotifications(notifications, profile._id);
        setUnreadCount(count);
      };

      const handleNewNotification = (notification: Notification) => {
        addNotification(notification, profile._id);
      };
      const handleUnreadCount = ({ count }: { count: number }) => {
        setUnreadCount(count);
      };
      const handleNotificationRead = ({
        notificationId,
        unreadCount: count,
      }: {
        notificationId: string;
        unreadCount: number;
      }) => {
        markAsRead(notificationId, profile._id);
        setUnreadCount(count);
      };
      const handleAllRead = () => markAllAsRead(profile._id);

      socket.on('notification:new', handleNewNotification);
      socket.on('notification:unread-count', handleUnreadCount);
      socket.on('notification:read', handleNotificationRead);
      socket.on('notifications:read-all', handleAllRead);

      hydrateNotifications().catch(() => {
        console.warn('Unable to hydrate notifications.');
      });

      return () => {
        socket.off('notification:new', handleNewNotification);
        socket.off('notification:unread-count', handleUnreadCount);
        socket.off('notification:read', handleNotificationRead);
        socket.off('notifications:read-all', handleAllRead);
      };
    } catch (error) {
      console.warn('Socket has not been initialized.');
    }
  }, [
    addNotification,
    markAllAsRead,
    markAsRead,
    profile?._id,
    token,
    setNotifications,
    setUnreadCount,
  ]);

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
