import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { getTeamMember } from '@/api/teamMembers';
import { getPlayerAttendanceRecord } from '@/api/schedule';
import SnackBar from '@/components/ui/SnackBar';
import { AttendanceCard } from '@/components/AttendenceCard';

const PlayerDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { playerId, teamId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [attendance, setAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
  });
  const [error, setError] = useState('');

  const positionLabels = Array.isArray(player?.positions)
    ? player.positions.filter((value: unknown) => typeof value === 'string' && value.trim() !== '')
    : typeof player?.positions === 'string'
      ? player.positions.split(',').map((value: string) => value.trim()).filter(Boolean)
      : [];
  const primaryPosition = positionLabels[0] ?? 'Unassigned';
  const supportingPositions = positionLabels.slice(1);

  useFocusEffect(
    useCallback(() => {
      const fetchPlayerDetails = async () => {
        setIsLoading(true);

        if (!playerId || !teamId) {
          setError('Missing player or team information');
          setIsLoading(false);
          return;
        }

        try {
          const response = await getTeamMember(teamId as string, playerId as string);
          const attendanceRecord = await getPlayerAttendanceRecord(playerId as string);

          setPlayer(response);
          setAttendance(attendanceRecord);
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load player details';

          setError(message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlayerDetails();
    }, [playerId, teamId]),
  );

  useEffect(() => {
    if (!player) return;

    navigation.setOptions({
      title: `${player.firstName} ${player.lastName}`,
      onEditPress: () => {
        router.push(`/teams/team/${teamId}/player/${playerId}/edit`);
      },
    });
  }, [navigation, player, playerId, teamId]);

  if (isLoading) {
    return (
      <ScreenContainer.Centered>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </ScreenContainer.Centered>
    );
  }

  return (
    <ScreenContainer.Scroll>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.avatarContainer}>
            {(player?.avatar || player?.imageUrl) ? (
              <Image
                source={{ uri: player?.avatar || player?.imageUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderBadge}>
                <MaterialCommunityIcons
                  name="account"
                  size={56}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </View>

          <View style={styles.heroContent}>
            <Text.Subheading style={styles.playerName}>
              {player?.firstName} {player?.lastName}
            </Text.Subheading>

            <View style={styles.positionRow}>
              <View style={[styles.positionBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text.Caption style={[styles.positionBadgeText, { color: theme.colors.onPrimaryContainer }]}>
                  {primaryPosition}
                </Text.Caption>
              </View>

              {supportingPositions.length > 0 ? (
                <Text.Caption style={styles.positionHint}>{supportingPositions.join(' • ')}</Text.Caption>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>First Name</Text.Caption>
            <Text.Body>{player?.firstName || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Last Name</Text.Caption>
            <Text.Body>{player?.lastName || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Jersey Number</Text.Caption>
            <Text.Body>{player?.jerseyNumber || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Position</Text.Caption>
            <Text.Body>{player?.positions?.join(', ') || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Status</Text.Caption>
            <Text.Body>
              {player?.isClaimed ? 'Claimed Account' : 'Unclaimed Player'}
            </Text.Body>
          </View>

          {!!player?.linkCode && (
            <View style={styles.infoRow}>
              <Text.Caption style={styles.label}>Link Code</Text.Caption>
              <Text.Body>{player.linkCode}</Text.Body>
            </View>
          )}
        </View>

        <View style={styles.attendanceSection}>
          <Text.Caption style={styles.label}>Attendance Record</Text.Caption>
          <AttendanceCard
            heading="Attendance Rate"
            present={attendance.present}
            late={attendance.late}
            absent={attendance.absent}
            total={attendance.total}
          />
        </View>
      </View>

      {!!error && (
        <SnackBar
          visible={true}
          onDismiss={() => setError('')}>
          {error}
        </SnackBar>
      )}
    </ScreenContainer.Scroll>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      gap: 20,
    },
    heroCard: {
      alignItems: 'center',
      gap: 12,
    },
    avatarContainer: {
      width: 144,
      height: 144,
      borderRadius: 36,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    placeholderBadge: {
      width: 92,
      height: 92,
      borderRadius: 999,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroContent: {
      alignItems: 'center',
      gap: 6,
    },
    playerName: {
      fontWeight: '700',
    },
    positionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
    positionBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    positionBadgeText: {
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    positionHint: {
      color: colors.onSurfaceVariant,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      gap: 18,
    },
    sectionTitle: {
      marginBottom: 4,
    },
    infoRow: {
      gap: 4,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    label: {
      color: colors.outline,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    attendanceSection: {
      gap: 8,
    },
  });

export default PlayerDetails;
