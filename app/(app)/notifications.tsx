import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Snackbar, Surface } from 'react-native-paper';

import {
  getNotifications as fetchNotifications,
  markNotificationRead,
} from '@/api/notification';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import {
  Notification,
  useNotificationStore,
} from '@/hooks/useNotification';
import { useSessionStore } from '@/hooks/useSessionStore';

dayjs.extend(relativeTime);

const Notifications = () => {
  const notifications = useNotificationStore(
    (state) => state.notifications,
  );

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const markAsRead = useNotificationStore(
    (state) => state.markAsRead,
  );

  const profile = useSessionStore(
    (state) => state.profile,
  );

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  useFocusEffect(
    useCallback(() => {
      if (!profile?._id) {
        return;
      }

      setLoading(true);

      const loadNotifications = async () => {
        try {
          const data = await fetchNotifications();

          setNotifications(data, profile._id);
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load notifications';

          setSnackbar({
            visible: true,
            message,
          });
        } finally {
          setLoading(false);
        }
      };

      loadNotifications();
    }, [profile?._id, setNotifications]),
  );

  const handleNotificationPress = async (notificationId: string) => {
    if (!profile?._id) {
      return;
    }

    try {
      await markNotificationRead(notificationId);
      markAsRead(notificationId, profile._id);
    } catch (error) {
      setSnackbar({
        visible: true,
        message: error instanceof Error
          ? error.message
          : 'Failed to mark notification as read',
      });
    }
  };

  const renderItem = ({
    item,
  }: {
    item: Notification;
  }) => (
    <Pressable onPress={() => handleNotificationPress(item._id)}>
      <Surface
        elevation={0}
        style={styles.card}
      >
        <View style={styles.content}>
          <Text.Subheading>
            {item.title}
          </Text.Subheading>

          <Text.Body style={styles.message}>
            {item.message}
          </Text.Body>

          <Text.Caption>
            {dayjs(item.createdAt).fromNow()}
          </Text.Caption>
        </View>
      </Surface>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({
            visible: false,
            message: '',
          })
        }
      >
        {snackbar.message}
      </Snackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9D9D9',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  content: {
    gap: 6,
  },
  message: {
    marginTop: 2,
  },
});

export default Notifications;
