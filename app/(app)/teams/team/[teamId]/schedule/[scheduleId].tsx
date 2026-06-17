import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Platform, Linking } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Button } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import SnackBar from '@/components/ui/SnackBar';
import { getTeamRoster } from '@/api/teamMembers';
import { updateAttendance } from '@/api/schedule';

type AttendanceStatus = 'present' | 'late' | 'absent' | null;

type AttendancePlayer = {
  id: string;
  initials: string;
  name: string;
  number: string;
  status: AttendanceStatus;
};

type TeamRosterPlayer = {
  profileId: string;
  firstName: string;
  lastName: string;
  role: string;
  jerseyNumber?: string;
};

type ScheduleAttendancePlayer = {
  profileId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: string;
  status: AttendanceStatus;
};

const ScheduleDetails = () => {
  const theme = useAppTheme();
  const navigation = useNavigation();

  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { teamId, scheduleId, schedule: scheduleParam } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const schedule = useMemo(() => {
    if (!scheduleParam || Array.isArray(scheduleParam)) {
      return null;
    }

    try {
      return JSON.parse(scheduleParam);
    } catch {
      return null;
    }
  }, [scheduleParam]);

  const eventDate = dayjs(
    schedule?.occurrenceStartDate ?? schedule?.startDate,
  );

  console.log('Schedule', JSON.stringify(schedule, null, 2));

  const dateLabel = eventDate.isSame(dayjs(), 'day')
    ? 'Today'
    : eventDate.format('MMM D, YYYY');

  const timeLabel = dayjs(schedule?.startTime).format('h:mm A');

  const mapPlayerToAttendance = (player: ScheduleAttendancePlayer): AttendancePlayer => {
    const firstName = player.firstName ?? '';
    const lastName = player.lastName ?? '';

    return {
      id: player.profileId,
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?',
      name: `${firstName} ${lastName}`.trim(),
      number: player.jerseyNumber || '--',
      status: player.status,
    };
  };

  const [attendance, setAttendance] = useState<AttendancePlayer[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Schedule Details',
    });
  }, [navigation]);

  useEffect(() => {
    const loadAttendance = async () => {

      if (!teamId || Array.isArray(teamId)) {
        return;
      }

      setIsLoading(true);

      try {
        const players = await getTeamRoster(teamId);

        const attendanceStatusMap = new Map<string, AttendanceStatus>(
          (schedule?.attendance ?? []).map((record: any) => [
            record.profileId,
            record.status as AttendanceStatus,
          ]),
        );

        const attendancePlayers = players
          .filter((player: TeamRosterPlayer) => player.role === 'player')
          .map((player: TeamRosterPlayer) =>
            mapPlayerToAttendance({
              profileId: player.profileId,
              firstName: player.firstName,
              lastName: player.lastName,
              jerseyNumber: player.jerseyNumber,
              status: (attendanceStatusMap.get(player.profileId) ?? null) as AttendanceStatus,
            }),
          );

        setAttendance(attendancePlayers);
      } catch (error) {
        setError('Unable to load roster. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendance();
  }, [schedule, teamId]);

  if (!schedule) {
    return (
      <ScreenContainer.Centered>
        <Text.Body>Unable to load schedule details.</Text.Body>
      </ScreenContainer.Centered>
    );
  }

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

  const presentCount = attendance.filter((p) => p.status === 'present').length;
  const lateCount = attendance.filter((p) => p.status === 'late').length;
  const absentCount = attendance.filter((p) => p.status === 'absent').length;
  const unmarkedCount = attendance.length - presentCount - lateCount - absentCount;

  const updateStatus = (
    playerId: string,
    status: Exclude<AttendanceStatus, null>,
  ) => {
    setAttendance((current) =>
      current.map((player) =>
        player.id === playerId
          ? {
            ...player,
            status,
          }
          : player,
      ),
    );
  };

  const handleSaveAttendance = async () => {
    if (!teamId || Array.isArray(teamId) || !scheduleId || Array.isArray(scheduleId)) {
      setError('Unable to save attendance. Missing schedule details.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateAttendance(scheduleId, {
        attendance: attendance.map((player) => ({
          profileId: player.id,
          firstName: player.name.split(' ')[0] ?? '',
          lastName: player.name.split(' ').slice(1).join(' ') ?? '',
          jerseyNumber: player.number === '--' ? '' : player.number,
          status: player.status,
        })),
      });

      setSuccessMessage('Attendance saved.');
    } catch (error) {
      setError('Unable to save attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to open map location
  const openMapLocation = async () => {
    const location = schedule.location;
    if (!location) return;
    const address = `${location.street}, ${location.city}, ${location.state}, ${location.zip}`;
    const encodedAddress = encodeURIComponent(address);
    const nativeUrl = Platform.OS === 'ios'
      ? `maps://?q=${encodedAddress}`
      : `geo:0,0?q=${encodedAddress}`;
    const webUrl = `https://maps.google.com/?q=${encodedAddress}`;
    try {
      const canOpenNative = await Linking.canOpenURL(nativeUrl);
      if (canOpenNative) {
        await Linking.openURL(nativeUrl);
        return;
      }
      await Linking.openURL(webUrl);
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  return (
    <ScreenContainer.Scroll>
      <View style={styles.container}>
        <View style={styles.eventCard}>
          <Text.Heading style={styles.eventTitle}>
            {schedule.title || schedule.opponentName || 'Untitled Event'}
          </Text.Heading>

          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.typeChip]}>
              <Text.Caption style={styles.chipText}>
                {schedule.type?.toUpperCase()}
              </Text.Caption>
            </View>

            {schedule.type === 'game' && (
              <View style={[styles.chip, styles.awayChip]}>
                <Text.Caption style={styles.chipText}>
                  {schedule.isHomeGame ? 'Home' : 'Away'}
                </Text.Caption>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.outline} />
            <Text.Body style={styles.infoText}>
              {dateLabel}
            </Text.Body>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.outline} />
            <Text.Body style={styles.infoText}>
              {timeLabel}
            </Text.Body>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.outline} />
            <Text.Body
              style={[
                styles.infoText,
                schedule.location && {
                  color: theme.colors.primary,
                  textDecorationLine: 'underline',
                },
              ]}
              onPress={schedule.location ? openMapLocation : undefined}
            >
              {schedule.location?.name ?? 'No location'}
            </Text.Body>
          </View>

          {schedule.type === 'game' && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.outline} />
              <Text.Body style={styles.infoText}>
                {schedule.opponentName || 'No opponent'}
              </Text.Body>
            </View>
          )}
        </View>

        <Text.Subheading style={styles.sectionTitle}>Attendance</Text.Subheading>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.status.success }]}>
            <Text.Body style={styles.summaryLabelPrimary}>Present</Text.Body>
            <Text.Heading style={{ color: theme.colors.button.primaryText }}>{presentCount}</Text.Heading>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.colors.status.warning }]}>
            <Text.Body style={styles.summaryLabelSecondary}>Late</Text.Body>
            <Text.Heading style={{ color: theme.colors.button.primaryText }}>{lateCount}</Text.Heading>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.colors.status.error }]}>
            <Text.Body style={styles.summaryLabelError}>Absent</Text.Body>
            <Text.Heading style={{ color: theme.colors.button.primaryText }}>{absentCount}</Text.Heading>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.colors.status.neutral }]}>
            <Text.Body style={styles.summaryLabelOutline}>Unmarked</Text.Body>
            <Text.Heading style={{ color: theme.colors.button.primaryText }}>{unmarkedCount}</Text.Heading>
          </View>
        </View>

        <View style={styles.attendanceCard}>
          {attendance.map((player) => (
            <View key={player.id} style={styles.attendanceRow}>
              <View style={styles.avatarCircle}>
                <Text.Body style={styles.avatarInitials}>{player.initials}</Text.Body>
              </View>

              <View style={styles.playerInfo}>
                <Text.Body style={styles.playerName}>{player.name}</Text.Body>
                <Text.Caption style={styles.playerNumber}>#{player.number}</Text.Caption>
              </View>

              <View style={styles.statusButtons}>
                <Button
                  mode={player.status === 'present' ? 'contained' : 'outlined'}
                  onPress={() => updateStatus(player.id, 'present')}
                  compact
                  style={styles.statusButton}
                  labelStyle={styles.statusButtonLabel}
                >
                  P
                </Button>

                <Button
                  mode={player.status === 'late' ? 'contained' : 'outlined'}
                  onPress={() => updateStatus(player.id, 'late')}
                  compact
                  style={styles.statusButton}
                  labelStyle={styles.statusButtonLabel}
                >
                  L
                </Button>

                <Button
                  mode={player.status === 'absent' ? 'contained' : 'outlined'}
                  onPress={() => updateStatus(player.id, 'absent')}
                  compact
                  style={styles.statusButton}
                  labelStyle={styles.statusButtonLabel}
                >
                  A
                </Button>
              </View>
            </View>
          ))}
        </View>

        {!!error && (
          <SnackBar
            visible={true}
            onDismiss={() => setError('')}>
            {error}
          </SnackBar>
        )}

        {!!successMessage && (
          <SnackBar
            visible={true}
            onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </SnackBar>
        )}

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleSaveAttendance}
            loading={isSaving}
            disabled={isSaving}
            style={styles.actionButton}
          >
            Save Attendance
          </Button>
          <Button mode="outlined" onPress={() => { }} style={styles.actionButton}>
            Edit Schedule
          </Button>
          <Button mode="outlined" onPress={() => { }} style={styles.actionButton} textColor={theme.colors.error}>
            Cancel Schedule
          </Button>
        </View>
      </View>
    </ScreenContainer.Scroll>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      gap: 20,
      paddingBottom: 32,
    },
    eventCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      alignItems: 'center',
      gap: 12,
    },
    icon: {
      marginBottom: 4,
    },
    eventTitle: {
      textAlign: 'center',
    },
    chipsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    chip: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    typeChip: {
      backgroundColor: colors.event.practice.background,
    },
    awayChip: {
      backgroundColor: colors.event.game.background,
    },
    chipText: {
      fontWeight: '600',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      paddingHorizontal: 8,
    },
    infoText: {
      color: colors.outline,
    },
    sectionTitle: {
      fontWeight: '700',
      color: colors.onSurfaceVariant,
      marginBottom: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    summaryCard: {
      flex: 1,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    summaryLabelPrimary: {
      color: colors.primary,
      fontSize: 12,
      textAlign: 'center',
      width: '100%',
    },
    summaryLabelSecondary: {
      color: colors.secondary,
      fontSize: 12,
      textAlign: 'center',
      width: '100%',
    },
    summaryLabelError: {
      color: colors.error,
      fontSize: 12,
      textAlign: 'center',
      width: '100%',
    },
    summaryLabelOutline: {
      color: colors.outline,
      fontSize: 12,
      textAlign: 'center',
      width: '100%',
    },
    attendanceCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      gap: 12,
    },
    attendanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.avatar.background,
      borderWidth: 1,
      borderColor: colors.avatar.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      color: colors.avatar.icon,
      fontWeight: '700',
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      fontWeight: '600',
      color: colors.onSurface,
    },
    playerNumber: {
      color: colors.outline,
    },
    statusButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    statusButton: {
      minWidth: 37,
      height: 37,
      justifyContent: 'center',
      borderRadius: 16,
      paddingHorizontal: 0,
    },
    statusButtonLabel: {
      fontWeight: '700',
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 18,
    },
    actionButtons: {
      marginTop: 20,
      gap: 12,
    },
    actionButton: {
      borderRadius: 20,
      paddingVertical: 8,
    },
  });

export default ScheduleDetails;
