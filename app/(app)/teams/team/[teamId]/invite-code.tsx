import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { getTeamInviteCodes } from '@/api/teams';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';
import dayjs from 'dayjs';
import { Snackbar, Surface } from 'react-native-paper';
import { updateInviteCodeStatus } from '@/api/invites';

type InviteCode = {
  _id: string;
  code: string;
  role: 'owner' | 'coach' | 'player';
  active: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt: Date | null;
  createdAt: Date | null;
};

type InviteSection = {
  title: string;
  data: InviteCode[];
};

type CodeCardProps = InviteCode & {
  onCopySuccess: () => void;
  onToggleStatus: () => void;
};

const CodeCard = ({
  code,
  role,
  active,
  usedCount,
  maxUses,
  expiresAt,
  createdAt,
  onCopySuccess,
  onToggleStatus,
}: CodeCardProps) => {
  const theme = useAppTheme();

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(code);

    onCopySuccess();
  };

  return (
    <Surface
      style={[
        styles.cardWrap,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
      elevation={1}
    >
      <View style={styles.card}>
        <View style={styles.cardTitle}>
          <View>
            <Text.Body>{code}</Text.Body>

            <View
              style={[
                styles.roleChip,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <Text.Caption>{role}</Text.Caption>
            </View>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: active
                  ? theme.dark
                    ? 'rgba(34,197,94,0.18)'
                    : 'rgba(34,197,94,0.12)'
                  : theme.dark
                    ? 'rgba(239,68,68,0.18)'
                    : 'rgba(239,68,68,0.12)',
              },
            ]}
          >
            <Text.Caption
              style={{
                color: active
                  ? theme.colors.primary
                  : theme.colors.error,
                fontWeight: '600',
              }}
            >
              {active ? 'Active' : 'Inactive'}
            </Text.Caption>
          </View>
        </View>

        <View style={styles.cardUseAndTime}>
          <Text.Caption
            style={{
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Uses {usedCount} / {maxUses}
          </Text.Caption>

          <Text.Caption
            style={{
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Expires{' '}
            {expiresAt
              ? dayjs(expiresAt).format('MMM DD, YYYY')
              : 'Never'}
          </Text.Caption>
        </View>

        <Text.Caption
          style={{
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Created {dayjs(createdAt).format('MMM DD, YYYY')}
        </Text.Caption>
      </View>

      <View
        style={[
          styles.cardButtonRow,
          {
            borderTopColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Pressable
          onPress={onToggleStatus}
          style={({ pressed }) => [
            styles.cardButtons,
            styles.cardButtonBorder,
            {
              borderColor: theme.colors.outlineVariant,
              opacity: pressed ? 0.65 : 1,
              backgroundColor: pressed
                ? theme.colors.surfaceVariant
                : 'transparent',
            },
          ]}
        >
          <Text.Body
            style={{
              color: theme.colors.error,
            }}
          >
            {active ? 'Deactivate' : 'Activate'}
          </Text.Body>
        </Pressable>

        <Pressable
          onPress={handleCopyCode}
          style={({ pressed }) => [
            styles.cardButtons,
            {
              opacity: pressed ? 0.65 : 1,
              backgroundColor: pressed
                ? theme.colors.surfaceVariant
                : 'transparent',
            },
          ]}
        >
          <Text.Body
            style={{
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Copy Code
          </Text.Body>
        </Pressable>
      </View>
    </Surface>
  );
};

const InviteCodeScreen = () => {
  const { teamId } = useLocalSearchParams();

  const [sections, setSections] = useState<InviteSection[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchInviteCodes = async () => {
        try {
          const data = await getTeamInviteCodes(teamId as string);
          setSections(data);
        } catch (error) {
          console.error('Failed to fetch invite codes:', error);
        }
      };

      fetchInviteCodes();
    }, [teamId]));

  const handleToggleStatus = useCallback(async (inviteId: string) => {
    try {
      const updatedInvite = await updateInviteCodeStatus(inviteId);

      setSections((prev) => {
        const invites = prev.flatMap((section) => section.data);

        const updatedInvites = invites.map((invite) =>
          invite._id === inviteId
            ? {
              ...invite,
              active: updatedInvite.active,
            }
            : invite
        );

        const activeInvites = updatedInvites.filter(
          (invite) => invite.active,
        );

        const inactiveInvites = updatedInvites.filter(
          (invite) => !invite.active,
        );

        return [
          {
            title: 'Active',
            data: activeInvites,
          },
          {
            title: 'Inactive',
            data: inactiveInvites,
          },
        ];
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        renderSectionHeader={({ section }) => (
          <Text.Label style={styles.header}>
            {section.title}
          </Text.Label>
        )}
        renderItem={({ item }) => (
          <CodeCard
            {...item}
            onCopySuccess={setSnackbarVisible.bind(this, true)}
            onToggleStatus={handleToggleStatus.bind(this, item._id)}
          />
        )}
      />

      <Snackbar
        visible={snackbarVisible}
        duration={2000}
        onDismiss={() => setSnackbarVisible(false)}
      >
        Invite code copied to clipboard.
      </Snackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 8,
  },
  cardWrap: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  cardUseAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardButtonRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
  },
  cardButtons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cardButtonBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});

export default InviteCodeScreen;
