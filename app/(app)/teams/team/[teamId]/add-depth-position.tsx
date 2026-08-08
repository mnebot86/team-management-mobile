import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, ChevronUp, Minus, Plus, X } from 'lucide-react-native';

import {
  getDeptCharts,
  updateDeptChart,
  type DeptChart,
  type DeptChartPositionInput,
} from '@/api/deptCharts';
import { getTeamRoster } from '@/api/teamMembers';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppSnackbar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

type RosterPlayer = {
  profileId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  positions?: string[] | string;
};

type Step = 'players' | 'order';

const AddDepthPositionModal = () => {
  const theme = useAppTheme();
  const { teamId, deptChartId, name: chartName, positionId } = useLocalSearchParams<{
    teamId: string;
    deptChartId: string;
    name: string;
    positionId?: string;
  }>();
  const isEditing = Boolean(positionId);
  const [step, setStep] = useState<Step>('players');
  const [positionName, setPositionName] = useState('');
  const [shortName, setShortName] = useState('');
  const [search, setSearch] = useState('');
  const [backupSlots, setBackupSlots] = useState(2);
  const [chart, setChart] = useState<DeptChart>();
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const showError = useCallback((error: unknown, fallback: string) => {
    setSnackbar({
      visible: true,
      message: error instanceof Error ? error.message : fallback,
    });
  }, []);

  useEffect(() => {
    if (!teamId || !deptChartId || !chartName) {
      setIsLoading(false);
      showError(undefined, 'Depth chart information is missing.');
      return;
    }

    let isActive = true;

    Promise.all([getDeptCharts(teamId, chartName), getTeamRoster(teamId, 'player')])
      .then(([charts, players]) => {
        if (!isActive) return;
        const selectedChart = charts.find((item) => item._id === deptChartId);
        setChart(selectedChart);
        setRoster(players);

        if (positionId) {
          const position = selectedChart?.positions.find((item) => item._id === positionId);

          if (!position) {
            showError(undefined, 'The selected position could not be found.');
            return;
          }

          const orderedPlayers = position.players
            .slice()
            .sort((a, b) => a.depth - b.depth);

          setPositionName(position.name);
          setShortName(position.shortName);
          setSelectedPlayerIds(orderedPlayers.map((player) => player.profileId));
          setBackupSlots(Math.max(2, orderedPlayers.length - 1));
        }
      })
      .catch((error) => {
        if (isActive) showError(error, 'Failed to load depth chart players.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [chartName, deptChartId, positionId, showError, teamId]);

  const maxPlayers = backupSlots + 1;
  const normalizedPosition = positionName.trim().toLowerCase();
  const normalizedShortName = shortName.trim().toLowerCase();

  const isRecommended = useCallback((player: RosterPlayer) => {
    const positions = Array.isArray(player.positions)
      ? player.positions
      : (player.positions ?? '').split(',');

    return positions.some((position) => {
      const normalized = position.trim().toLowerCase();
      return normalized !== ''
        && (normalized === normalizedPosition || normalized === normalizedShortName);
    });
  }, [normalizedPosition, normalizedShortName]);

  const visiblePlayers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roster
      .filter((player) => {
        if (!query) return true;
        return `${player.firstName} ${player.lastName} ${player.jerseyNumber ?? ''}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => Number(isRecommended(b)) - Number(isRecommended(a)));
  }, [isRecommended, roster, search]);

  const selectedPlayers = useMemo(
    () => selectedPlayerIds
      .map((profileId) => roster.find((player) => player.profileId === profileId))
      .filter((player): player is RosterPlayer => Boolean(player)),
    [roster, selectedPlayerIds],
  );

  const togglePlayer = (profileId: string) => {
    setSelectedPlayerIds((current) => {
      if (current.includes(profileId)) return current.filter((id) => id !== profileId);
      if (current.length >= maxPlayers) {
        showError(undefined, 'Add another backup spot before selecting another player.');
        return current;
      }
      return [...current, profileId];
    });
  };

  const changeBackupSlots = (change: -1 | 1) => {
    setBackupSlots((current) => {
      const next = Math.max(0, current + change);
      setSelectedPlayerIds((players) => players.slice(0, next + 1));
      return next;
    });
  };

  const movePlayer = (index: number, direction: -1 | 1) => {
    setSelectedPlayerIds((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const continueToOrder = () => {
    if (!positionName.trim() || !shortName.trim()) {
      showError(undefined, 'Enter the position name and abbreviation.');
      return;
    }
    if (selectedPlayerIds.length === 0) {
      showError(undefined, 'Select at least one player for this position.');
      return;
    }
    setStep('order');
  };

  const handleSave = async () => {
    if (!chart || !deptChartId) {
      showError(undefined, 'Depth chart could not be found.');
      return;
    }

    const positionInput: DeptChartPositionInput = {
      name: positionName.trim(),
      shortName: shortName.trim().toUpperCase(),
      sortOrder: chart.positions.length + 1,
      players: selectedPlayerIds.map((profileId, index) => ({ profileId, depth: index + 1 })),
    };

    const positions: DeptChartPositionInput[] = chart.positions.map((position) => {
      if (positionId && position._id === positionId) {
        return {
          ...positionInput,
          sortOrder: position.sortOrder,
        };
      }

      return {
        name: position.name,
        shortName: position.shortName,
        sortOrder: position.sortOrder,
        players: position.players.map(({ profileId, depth }) => ({ profileId, depth })),
      };
    });

    if (!positionId) {
      positions.push(positionInput);
    }

    try {
      setIsSaving(true);
      await updateDeptChart(deptChartId, {
        name: chart.name,
        positions,
      });
      router.back();
    } catch (error) {
      showError(error, `Failed to ${isEditing ? 'update' : 'add'} the position.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer.Centered>
        <ActivityIndicator color={theme.colors.accent} />
      </ScreenContainer.Centered>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHeader}>
          <Text.Body variant="accent">Step {step === 'players' ? '1' : '2'} of 2</Text.Body>
          <Text.Subheading>
            {step === 'players' ? 'Choose Players' : 'Set Player Order'}
          </Text.Subheading>
        </View>

        {step === 'players' ? (
          <>
            <View style={[
              styles.sectionCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
            ]}>
              <Text.Subheading>Position Setup</Text.Subheading>
              <Input.Text
                label="Position Name"
                value={positionName}
                onChangeText={setPositionName}
                placeholder="Quarterback"
                autoCapitalize="words"
              />
              <Input.Text
                label="Abbreviation"
                value={shortName}
                onChangeText={setShortName}
                placeholder="QB"
                autoCapitalize="characters"
                maxLength={5}
              />

              <View style={styles.slotControls}>
                <View>
                  <Text.Body style={styles.controlLabel}>Backup spots</Text.Body>
                  <Text.Caption>One starter is included automatically</Text.Caption>
                </View>
                <View style={[
                  styles.slotStepper,
                  { backgroundColor: theme.colors.avatar.background },
                ]}>
                  <Pressable
                    accessibilityLabel="Remove a backup spot"
                    disabled={backupSlots === 0}
                    onPress={() => changeBackupSlots(-1)}
                    style={[styles.stepperButton, { opacity: backupSlots === 0 ? 0.3 : 1 }]}
                  >
                    <Minus size={18} color={theme.colors.icon.secondary} />
                  </Pressable>
                  <Text.Body style={styles.stepperValue}>{backupSlots}</Text.Body>
                  <Pressable
                    accessibilityLabel="Add a backup spot"
                    onPress={() => changeBackupSlots(1)}
                    style={styles.stepperButton}
                  >
                    <Plus size={18} color={theme.colors.icon.secondary} />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={[
              styles.sectionCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
            ]}>
              <View style={styles.sectionHeading}>
                <Text.Subheading>Select Players</Text.Subheading>
                <Text.Caption>{selectedPlayerIds.length} / {maxPlayers} selected</Text.Caption>
              </View>
              <Input.Text
                value={search}
                onChangeText={setSearch}
                placeholder="Search by name or number"
                rightIcon="magnify"
              />
              <Text.Caption>Players matching this position appear first.</Text.Caption>

              <ScrollView
                nestedScrollEnabled
                style={styles.playerList}
                contentContainerStyle={styles.playerListContent}
                keyboardShouldPersistTaps="handled"
              >
                {visiblePlayers.length === 0 ? (
                  <Text.Body variant="muted" style={styles.centerText}>No matching players found.</Text.Body>
                ) : visiblePlayers.map((player) => {
                const selected = selectedPlayerIds.includes(player.profileId);
                const recommended = isRecommended(player);
                return (
                  <Pressable
                    key={player.profileId}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => togglePlayer(player.profileId)}
                    style={[
                      styles.playerOption,
                      {
                        backgroundColor: theme.colors.card.background,
                        borderColor: selected ? theme.colors.accent : theme.colors.card.border,
                      },
                    ]}
                  >
                    <View style={[
                      styles.checkbox,
                      {
                        backgroundColor: selected ? theme.colors.accent : 'transparent',
                        borderColor: selected ? theme.colors.accent : theme.colors.text.secondary,
                      },
                    ]}>
                      {selected && <Check size={16} color={theme.colors.button.primaryText} />}
                    </View>
                    <View style={styles.playerOptionName}>
                      <Text.Body>{player.firstName} {player.lastName}</Text.Body>
                      {recommended && (
                        <Text.Caption style={{ color: theme.colors.text.accent }}>
                          Recommended
                        </Text.Caption>
                      )}
                    </View>
                    {player.jerseyNumber !== undefined && <Text.Body variant="muted">#{player.jerseyNumber}</Text.Body>}
                  </Pressable>
                );
                })}
              </ScrollView>
            </View>

            <View style={styles.footerActions}>
              <AppButton variant="secondary" fullWidth={false} compact style={styles.footerButton} onPress={() => router.back()}>
                Cancel
              </AppButton>
              <AppButton fullWidth={false} compact style={styles.footerButton} onPress={continueToOrder}>
                Continue
              </AppButton>
            </View>
          </>
        ) : (
          <>
            <View style={[
              styles.sectionCard,
              { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
            ]}>
              <Text.Body variant="muted">
                The first player is first string. Reorder or remove backups as needed.
              </Text.Body>
              {selectedPlayers.map((player, index) => (
              <View key={player.profileId} style={[
                styles.orderRow,
                { backgroundColor: theme.colors.screen.background, borderColor: theme.colors.card.border },
              ]}>
                <View style={[styles.orderNumber, { backgroundColor: theme.colors.button.primaryBackground }]}>
                  <Text.Body style={{ color: theme.colors.button.primaryText }}>{index + 1}</Text.Body>
                </View>
                <View style={styles.orderName}>
                  <Text.Body>{player.firstName} {player.lastName}</Text.Body>
                  <Text.Body variant="muted">{index === 0 ? 'First string' : `Backup ${index}`}</Text.Body>
                </View>
                <Pressable disabled={index === 0} onPress={() => movePlayer(index, -1)} style={[styles.orderIconButton, { backgroundColor: theme.colors.avatar.background, opacity: index === 0 ? 0.3 : 1 }]}>
                  <ChevronUp size={24} color={theme.colors.icon.secondary} />
                </Pressable>
                <Pressable disabled={index === selectedPlayers.length - 1} onPress={() => movePlayer(index, 1)} style={[styles.orderIconButton, { backgroundColor: theme.colors.avatar.background, opacity: index === selectedPlayers.length - 1 ? 0.3 : 1 }]}>
                  <ChevronDown size={24} color={theme.colors.icon.secondary} />
                </Pressable>
                <Pressable accessibilityLabel={`Remove ${player.firstName}`} onPress={() => togglePlayer(player.profileId)} style={[styles.orderIconButton, { backgroundColor: theme.colors.avatar.background }]}>
                  <X size={20} color={theme.colors.error} />
                </Pressable>
              </View>
              ))}
              <AppButton variant="text" compact icon="plus" onPress={() => {
                setBackupSlots((current) => current + 1);
                setStep('players');
              }}>
                Add another backup
              </AppButton>
            </View>

            <View style={styles.footerActions}>
              <AppButton variant="secondary" fullWidth={false} compact style={styles.footerButton} disabled={isSaving} onPress={() => setStep('players')}>
                Back
              </AppButton>
              <AppButton fullWidth={false} compact style={styles.footerButton} loading={isSaving} disabled={isSaving || selectedPlayers.length === 0} onPress={handleSave}>
                {isEditing ? 'Save Changes' : 'Add Position'}
              </AppButton>
            </View>
          </>
        )}
      </ScrollView>

      <AppSnackbar visible={snackbar.visible} variant="error" onDismiss={() => setSnackbar({ visible: false, message: '' })}>
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { gap: 18, padding: 16, paddingBottom: 40 },
  stepHeader: { gap: 4 },
  sectionCard: { gap: 14, padding: 16, borderWidth: 1, borderRadius: 18 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  slotControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  controlLabel: { fontWeight: '600' },
  slotStepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 20 },
  stepperButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { minWidth: 24, textAlign: 'center', fontWeight: '700' },
  playerList: { maxHeight: 360 },
  playerListContent: { gap: 10 },
  playerOption: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, borderWidth: 1, borderRadius: 14 },
  checkbox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 7 },
  playerOptionName: { flex: 1 },
  centerText: { textAlign: 'center', paddingVertical: 32 },
  orderRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderWidth: 1, borderRadius: 14 },
  orderNumber: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  orderName: { flex: 1 },
  orderIconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17 },
  footerActions: { flexDirection: 'row', gap: 12, paddingTop: 2 },
  footerButton: { flex: 1 },
});

export default AddDepthPositionModal;
