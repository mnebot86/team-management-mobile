import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View, Platform, Linking } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import SnackBar from '@/components/ui/SnackBar';
import { getTeamRoster } from '@/api/teamMembers';
import { cancelSchedule, CancellationScope, deleteSchedule, updateAttendance } from '@/api/schedule';
import { buildCancellationPayload } from '@/utils/scheduleCancellation';
import { useScheduleInvalidationStore } from '@/hooks/useScheduleInvalidationStore';

type AttendanceStatus = 'present' | 'late' | 'absent' | null;

type AttendancePlayer = {
  id: string;
  imageUrl?: string | null;
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
  imageUrl?: string | null;
};

type ScheduleAttendancePlayer = {
  profileId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: string;
  imageUrl?: string | null;
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
  const invalidateTeamSchedule = useScheduleInvalidationStore((state) => state.invalidateTeamSchedule);

  const parsedSchedule = useMemo(() => {
    if (!scheduleParam || Array.isArray(scheduleParam)) {
      return null;
    }

    try {
      return JSON.parse(scheduleParam);
    } catch {
      return null;
    }
  }, [scheduleParam]);
  const [schedule, setSchedule] = useState<any>(parsedSchedule);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditScopeDialog, setShowEditScopeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteScope, setDeleteScope] = useState<CancellationScope | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationScope, setCancellationScope] = useState<CancellationScope | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const isCancelled = schedule?.status === 'cancelled';
  const isRecurring = Boolean(schedule?.recurrenceGroupId || schedule?.recurrence?.isRecurring);
  const isMaterialized = Boolean(schedule?.recurrenceGroupId);

  useEffect(() => setSchedule(parsedSchedule), [parsedSchedule]);

  const eventDate = dayjs(
    schedule?.occurrenceStartDate ?? schedule?.startDate,
  );

  const dateLabel = eventDate.isSame(dayjs(), 'day')
    ? 'Today'
    : eventDate.format('MMM D, YYYY');

  const timeLabel = dayjs(schedule?.startTime).format('h:mm A');

  const mapPlayerToAttendance = (player: ScheduleAttendancePlayer): AttendancePlayer => {
    const firstName = player.firstName ?? '';
    const lastName = player.lastName ?? '';

    return {
      id: player.profileId,
      imageUrl: player.imageUrl,
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

  useFocusEffect(
    useCallback(() => {
      const loadAttendance = async () => {
        if (isCancelled) return;
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
                imageUrl: player.imageUrl,
                status: (attendanceStatusMap.get(player.profileId) ?? null) as AttendanceStatus,
              }),
            );

          setAttendance(attendancePlayers);
        } catch {
          setError('Unable to load roster. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      loadAttendance();
    }, [isCancelled, schedule, teamId]),
  );

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
        ...(!isMaterialized && schedule.recurrenceDate
          ? { occurrenceDate: schedule.recurrenceDate }
          : {}),
        attendance: attendance.map((player) => {
          const fullName = typeof player.name === 'string' ? player.name : '';
          const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
          const firstName = nameParts[0] ?? '';
          const lastName = nameParts.slice(1).join(' ');

          return {
            profileId: player.id,
            firstName,
            lastName,
            jerseyNumber: player.number === '--' ? '' : player.number,
            status: player.status,
          };
        }),
      });

      setSuccessMessage('Attendance saved.');
    } catch (error) {
      setError('Unable to save attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!scheduleId || Array.isArray(scheduleId) || isDeleting) return;
    const scope = isRecurring ? deleteScope : 'occurrence';
    if (!scope) {
      setError('Choose whether to delete this event or the entire series.');
      return;
    }

    setIsDeleting(true);
    setError('');
    try {
      await deleteSchedule(scheduleId, scope);
      setShowDeleteDialog(false);
      setDeleteScope(null);
      if (teamId && !Array.isArray(teamId)) invalidateTeamSchedule(teamId);
      router.replace({
        pathname: '/(app)/teams/team/[teamId]/(drawer)/schedule',
        params: { teamId: String(teamId) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete event.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = async () => {
    if (!scheduleId || Array.isArray(scheduleId) || isCancelling) return;
    if (isRecurring && !cancellationScope) {
      setError('Choose whether to cancel this event or the entire series.');
      return;
    }
    setIsCancelling(true);
    setError('');
    try {
      const payload = buildCancellationPayload({
        isRecurring,
        scope: cancellationScope,
        occurrenceDate: schedule.recurrenceDate,
        isMaterialized,
        reason: cancellationReason,
      });
      await cancelSchedule(scheduleId, payload);
      setShowCancelDialog(false);
      setCancellationScope(null);
      setCancellationReason('');
      if (teamId && !Array.isArray(teamId)) invalidateTeamSchedule(teamId);
      router.replace({
        pathname: '/(app)/teams/team/[teamId]/(drawer)/schedule',
        params: { teamId: String(teamId) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel event.');
    } finally {
      setIsCancelling(false);
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
            {isCancelled && (
              <View style={[styles.chip, { backgroundColor: theme.colors.errorContainer }]}>
                <Text.Caption style={{ color: theme.colors.onErrorContainer }}>CANCELLED</Text.Caption>
              </View>
            )}
          </View>

          {isCancelled && schedule.cancellationReason && (
            <Text.Body style={{ color: theme.colors.error }}>
              Reason: {schedule.cancellationReason}
            </Text.Body>
          )}

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

        {!!error && (
          <SnackBar visible onDismiss={() => setError('')} variant="error">
            {error}
          </SnackBar>
        )}

        {!!successMessage && (
          <SnackBar visible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </SnackBar>
        )}

        {!isCancelled && <>
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
                {player.imageUrl ? (
                  <Image
                    source={{ uri: player.imageUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                    accessibilityLabel={`${player.name} profile photo`}
                  />
                ) : (
                  <Text.Body style={styles.avatarInitials}>{player.initials}</Text.Body>
                )}
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
          <Button mode="outlined" onPress={() => {
            if (isRecurring) {
              setShowEditScopeDialog(true);
              return;
            }
            router.push({
              pathname: '/(app)/teams/team/[teamId]/edit-schedule-modal',
              params: { teamId: String(teamId), scheduleId: String(scheduleId), recurrenceDate: schedule.recurrenceDate, schedule: JSON.stringify(schedule) },
            });
          }} style={styles.actionButton}>
            Edit Schedule
          </Button>
          <Button mode="outlined" onPress={() => {
            setCancellationScope(null);
            setShowCancelDialog(true);
          }} style={styles.actionButton} textColor={theme.colors.error}>
            Cancel Event
          </Button>
          <Button mode="outlined" onPress={() => {
            setDeleteScope(null);
            setShowDeleteDialog(true);
          }} style={styles.actionButton} textColor={theme.colors.error}>
            Delete Event
          </Button>
        </View>
        </>}
        {isCancelled && (
          <View style={styles.actionButtons}>
            <Button mode="outlined" onPress={() => {
              setDeleteScope(null);
              setShowDeleteDialog(true);
            }} style={styles.actionButton} textColor={theme.colors.error}>
              Delete Event
            </Button>
          </View>
        )}
      </View>

      <Portal>
        <Dialog visible={showEditScopeDialog} onDismiss={() => setShowEditScopeDialog(false)}>
          <Dialog.Title>Edit Recurring Event</Dialog.Title>
          <Dialog.Content>
            <Text.Body>Choose whether to edit only this occurrence or the entire recurring series.</Text.Body>
          </Dialog.Content>
          <Dialog.Actions style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Button onPress={() => {
              setShowEditScopeDialog(false);
              router.push({
                pathname: '/(app)/teams/team/[teamId]/edit-schedule-modal',
                params: { teamId: String(teamId), scheduleId: String(scheduleId), recurrenceDate: schedule.recurrenceDate, schedule: JSON.stringify(schedule), editScope: 'occurrence' },
              });
            }}>Edit this event</Button>
            <Button onPress={() => {
              setShowEditScopeDialog(false);
              router.push({
                pathname: '/(app)/teams/team/[teamId]/edit-schedule-modal',
                params: { teamId: String(teamId), scheduleId: String(scheduleId), recurrenceDate: schedule.recurrenceDate, schedule: JSON.stringify(schedule), editScope: 'series' },
              });
            }}>Edit all events in this series</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showCancelDialog} onDismiss={() => !isCancelling && setShowCancelDialog(false)}>
          <Dialog.Title>Cancel Event?</Dialog.Title>
          <Dialog.Content>
            {isRecurring ? (
              <>
                <Text.Body>Choose what to cancel. Other occurrences stay scheduled when only this event is canceled.</Text.Body>
                <Button
                  mode={cancellationScope === 'occurrence' ? 'contained' : 'outlined'}
                  onPress={() => setCancellationScope('occurrence')}
                  disabled={isCancelling}
                  style={{ marginTop: 16 }}
                >
                  Cancel this event
                </Button>
                <Button
                  mode={cancellationScope === 'series' ? 'contained' : 'outlined'}
                  onPress={() => setCancellationScope('series')}
                  disabled={isCancelling}
                  style={{ marginTop: 8 }}
                >
                  Cancel all events in this series
                </Button>
                {cancellationScope && (
                  <Text.Body style={{ marginTop: 16 }}>
                    {cancellationScope === 'occurrence'
                      ? 'Confirm: only this occurrence will be canceled.'
                      : 'Confirm: every event in this recurring series will be canceled.'}
                  </Text.Body>
                )}
              </>
            ) : (
              <Text.Body>This event will remain visible as cancelled. This cannot be undone.</Text.Body>
            )}
            <TextInput
              label="Cancellation reason (optional)"
              value={cancellationReason}
              onChangeText={setCancellationReason}
              multiline
              disabled={isCancelling}
              style={{ marginTop: 16 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)} disabled={isCancelling}>Keep Event</Button>
            <Button
              onPress={handleCancel}
              loading={isCancelling}
              disabled={isCancelling || (isRecurring && !cancellationScope)}
              textColor={theme.colors.error}
            >
              {cancellationScope === 'series' ? 'Cancel Entire Series' : 'Confirm Cancellation'}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={() => !isDeleting && setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Event?</Dialog.Title>
          <Dialog.Content>
            {isRecurring ? (
              <>
                <Text.Body>Deleted events are permanently removed. Choose what to delete.</Text.Body>
                <Button
                  mode={deleteScope === 'occurrence' ? 'contained' : 'outlined'}
                  onPress={() => setDeleteScope('occurrence')}
                  disabled={isDeleting}
                  style={{ marginTop: 16 }}
                >
                  Delete this event
                </Button>
                <Button
                  mode={deleteScope === 'series' ? 'contained' : 'outlined'}
                  onPress={() => setDeleteScope('series')}
                  disabled={isDeleting}
                  textColor={theme.colors.error}
                  style={{ marginTop: 8 }}
                >
                  Delete all events in this series
                </Button>
                {deleteScope && (
                  <Text.Body style={{ marginTop: 16, color: theme.colors.error }}>
                    {deleteScope === 'series'
                      ? 'Confirm: every event in this series will be permanently deleted.'
                      : 'Confirm: only this event will be permanently deleted.'}
                  </Text.Body>
                )}
              </>
            ) : (
              <Text.Body>This event will be permanently deleted. This cannot be undone.</Text.Body>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)} disabled={isDeleting}>Keep Event</Button>
            <Button
              onPress={handleDelete}
              loading={isDeleting}
              disabled={isDeleting || (isRecurring && !deleteScope)}
              textColor={theme.colors.error}
            >
              {deleteScope === 'series' ? 'Delete Entire Series' : 'Confirm Delete'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
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
