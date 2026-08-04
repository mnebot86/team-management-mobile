import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Card, Surface } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import IconButton from '@/components/ui/IconButton';
import { useAppTheme } from '@/hooks/useAppTheme';

const Settings = () => {
  const theme = useAppTheme();

  const handleRouterVisitCode = useCallback(() => {
    router.push('../invite-code');
  }, []);

  return (
    <ScreenContainer>
      <Pressable
        onPress={handleRouterVisitCode}
        android_ripple={{ borderless: false }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Surface
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card.background,
              borderColor: theme.colors.card.border,
              borderWidth: 1,
            },
          ]}
        >
          <Card.Title
            style={[
              styles.title,
              {
                borderBottomColor: theme.colors.card.border,
              },
            ]}
            title="Invite Code"
            titleStyle={{
              color: theme.colors.text.primary,
            }}
            subtitle="Manage invitation codes"
            subtitleStyle={{
              color: theme.colors.text.secondary,
            }}
            right={(props) => (
              <IconButton
                {...props}
                icon="chevron-right"
                iconColor={theme.colors.text.secondary}
              />
            )}
          />
        </Surface>
      </Pressable>
    </ScreenContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 16,
  },
  title: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
