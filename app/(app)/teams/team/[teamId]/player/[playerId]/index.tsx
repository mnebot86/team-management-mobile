import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { getTeamMember } from '@/api/teamMembers';
import { getPlayerAttendanceRecord } from '@/api/schedule';
import SnackBar from '@/components/ui/SnackBar';
import { AttendanceCard } from '@/components/AttendenceCard';
import { useAppTheme } from '@/hooks/useAppTheme';

const PlayerDetails = () => {
  const theme = useAppTheme();
  const colors = theme.colors;
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
  const positionInitials = positionLabels.map((position: string) => {
    if (/^[A-Z0-9]{1,4}$/.test(position)) return position;
    return position.split(/[\s/-]+/).filter(Boolean).map((word) => word[0]).join('').toUpperCase();
  });
  const hasJerseyNumber = player?.jerseyNumber !== null
    && player?.jerseyNumber !== undefined
    && String(player.jerseyNumber).trim() !== '';
  const hasPlayerMeta = hasJerseyNumber || positionInitials.length > 0;

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
        <View style={styles.heroSection}>
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
                  size={96}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </View>

          {hasPlayerMeta && (
            <View style={styles.playerMetaCard}>
              <View style={styles.positionRow}>
                {positionInitials.map((position: string, index: number) => (
                  <View
                    key={`${position}-${index}`}
                    style={[styles.positionBadge, { backgroundColor: colors.avatar.background, borderColor: colors.avatar.border }]}
                  >
                    <Text.Caption style={[styles.positionBadgeText, { color: colors.onSurface }]}>{position}</Text.Caption>
                  </View>
                ))}
              </View>
              {hasJerseyNumber && (
                <Text.Heading style={styles.jerseyNumber}>#{player.jerseyNumber}</Text.Heading>
              )}
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

        <View style={styles.sectionCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.avatar.background }]}>
              <MaterialCommunityIcons
                name={player?.isClaimed ? 'account-check-outline' : 'account-clock-outline'}
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoContent}>
              <Text.Caption style={styles.label}>Account status</Text.Caption>
              <Text.Body>{player?.isClaimed ? 'Claimed account' : 'Unclaimed player'}</Text.Body>
            </View>
          </View>

          {!!player?.linkCode && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.avatar.background }]}>
                <MaterialCommunityIcons name="link-variant" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text.Caption style={styles.label}>Link code</Text.Caption>
                <Text.Body>{player.linkCode}</Text.Body>
              </View>
            </View>
          )}
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
      paddingBottom: 32,
      gap: 24,
    },
    heroSection: {
      width: '100%',
      marginTop: 12,
    },
    avatarContainer: {
      width: '100%',
      aspectRatio: 1.05,
      borderRadius: 28,
      backgroundColor: colors.avatar.background,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.outlineVariant,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    placeholderBadge: {
      width: 160,
      height: 160,
      borderRadius: 999,
      backgroundColor: colors.avatar.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerMetaCard: {
      marginTop: 12,
      marginHorizontal: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    positionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      flex: 1,
    },
    positionBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    positionBadgeText: {
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    jerseyNumber: {
      fontWeight: '800',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.segment.selectedBackground,
      color: colors.segment.selectedText,
      overflow: 'hidden',
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      overflow: 'hidden',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
    },
    infoIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoContent: {
      flex: 1,
      gap: 2,
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
