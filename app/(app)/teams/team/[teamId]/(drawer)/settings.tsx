import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import ScreenContainer from '@/components/layout/Screen';
import AppIcon from '@/components/AppIcon';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

const Settings = () => {
  const theme = useAppTheme();

  const handleRouterVisitCode = useCallback(() => {
    router.push('../invite-code');
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text.Caption style={[styles.sectionLabel, { color: theme.colors.text.secondary }]}>Team access</Text.Caption>
          <Text.Body variant="muted">Control how people join this team.</Text.Body>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Manage invitation codes"
          onPress={handleRouterVisitCode}
          style={({ pressed }) => [
            styles.settingRow,
            {
              backgroundColor: theme.colors.card.background,
              borderColor: theme.colors.card.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.avatar.background }]}>
            <AppIcon name="account-multiple-plus-outline" size={22} />
          </View>

          <View style={styles.rowContent}>
            <Text.Subheading style={styles.rowTitle}>Invite codes</Text.Subheading>
            <Text.Caption style={{ color: theme.colors.text.secondary }}>Create and manage team invitations</Text.Caption>
          </View>

          <AppIcon name="chevron-right" size={22} variant="muted" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    gap: 14,
  },
  sectionHeader: {
    gap: 3,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontWeight: '700',
  },
  settingRow: {
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontWeight: '600',
  },
});
