import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';

import {
  getDeptChartFilters,
  getDeptCharts,
  deleteDeptChart,
  type DeptChart,
  type DeptChartPlayer,
  type DeptChartPosition,
} from '@/api/deptCharts';
import { getTeamRoster } from '@/api/teamMembers';
import ScreenContainer from '@/components/layout/Screen';
import AppSnackbar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTeamStore } from '@/hooks/useTeamStore';

type RosterPlayer = {
  profileId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  imageUrl?: string | null;
};

const getInitials = (player: DeptChartPlayer) => {
  if (!player.firstName && !player.lastName) {
    return '--';
  }

  return `${player.firstName?.charAt(0) ?? ''}${player.lastName?.charAt(0) ?? ''}`.toUpperCase();
};

const DeptCharts = () => {
  const theme = useAppTheme();
  const teamId = useTeamStore((state) => state.getTeamId());

  const [filters, setFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [deptCharts, setDeptCharts] = useState<DeptChart[]>([]);
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [deletingChartId, setDeletingChartId] = useState<string>();
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useFocusEffect(
    useCallback(() => {
      if (!teamId) {
        setFilters([]);
        setSelectedFilter(undefined);
        setDeptCharts([]);
        setIsLoadingFilters(false);

        return;
      }

      let isActive = true;

      setIsLoadingFilters(true);

      Promise.all([
        getDeptChartFilters(teamId),
        getTeamRoster(teamId, 'player'),
      ]).then(([nextFilters, players]) => {
        if (!isActive) return;

        setFilters(nextFilters);
        setRoster(players);
        setSelectedFilter((currentFilter) =>
          currentFilter && nextFilters.includes(currentFilter)
            ? currentFilter
            : nextFilters[0],
        );

        if (nextFilters.length === 0) {
          setDeptCharts([]);
        }
      }).catch((error) => {
        if (!isActive) return;

        setFilters([]);
        setRoster([]);
        setSelectedFilter(undefined);
        setDeptCharts([]);
        setSnackbar({
          visible: true,
          message: error instanceof Error
            ? error.message
            : 'Failed to load depth chart filters.',
        });
      })
        .finally(() => {
          if (isActive) setIsLoadingFilters(false);
        });

      return () => {
        isActive = false;
      };
    }, [teamId]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!teamId || !selectedFilter) {
        setDeptCharts([]);
        setIsLoadingCharts(false);

        return;
      }

      let isActive = true;

      setIsLoadingCharts(true);
      setDeptCharts([]);

      getDeptCharts(teamId, selectedFilter)
        .then((charts) => {
          if (isActive) setDeptCharts(charts);
        })
        .catch((error) => {
          if (!isActive) return;

          setDeptCharts([]);
          setSnackbar({
            visible: true,
            message: error instanceof Error
              ? error.message
              : 'Failed to load depth charts.',
          });
        })
        .finally(() => {
          if (isActive) setIsLoadingCharts(false);
        });

      return () => {
        isActive = false;
      };
    }, [selectedFilter, teamId]),
  );

  const handleEditChart = (chart: DeptChart) => {
    router.push({
      pathname: '/(app)/teams/team/[teamId]/edit-dept-chart',
      params: {
        teamId: teamId ?? '',
        deptChartId: chart._id,
        name: chart.name,
      },
    });
  };

  const handleDeleteChart = (chart: DeptChart) => {
    if (deletingChartId) return;

    Alert.alert(
      'Delete depth chart?',
      `This will permanently delete ${chart.name} and every position in it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingChartId(chart._id);
              await deleteDeptChart(chart._id);

              setDeptCharts((current) => current.filter((item) => item._id !== chart._id));
              const nextFilters = filters.filter((filter) => filter !== chart.name);
              setFilters(nextFilters);
              setSelectedFilter(nextFilters[0]);
            } catch (error) {
              setSnackbar({
                visible: true,
                message: error instanceof Error
                  ? error.message
                  : 'Failed to delete depth chart.',
              });
            } finally {
              setDeletingChartId(undefined);
            }
          },
        },
      ],
    );
  };

  const handleAddPosition = (chart: DeptChart) => {
    router.push({
      pathname: '/(app)/teams/team/[teamId]/add-depth-position',
      params: {
        teamId: teamId ?? '',
        deptChartId: chart._id,
        name: chart.name,
      },
    });
  };

  const handleEditPosition = (chart: DeptChart, position: DeptChartPosition) => {
    router.push({
      pathname: '/(app)/teams/team/[teamId]/edit-depth-position',
      params: {
        teamId: teamId ?? '',
        deptChartId: chart._id,
        name: chart.name,
        positionId: position._id ?? '',
      },
    });
  };

  const renderPosition = (
    item: DeptChartPosition,
    chart: DeptChart,
  ) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card.background,
          borderColor: theme.colors.card.border,
        },
      ]}
    >
      <View style={[styles.cardHeader, { borderBottomColor: theme.colors.card.border }]}>
        <View style={styles.positionTitle}>
          <View style={[styles.positionBadge, { backgroundColor: theme.colors.avatar.background }]}>
            <Text.Body style={styles.positionCode}>{item.shortName}</Text.Body>
          </View>
          <Text.Subheading style={styles.positionName}>{item.name}</Text.Subheading>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${item.name}`}
          onPress={() => handleEditPosition(chart, item)}
          style={({ pressed }) => [
            styles.editButton,
            {
              backgroundColor: theme.colors.avatar.background,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Pencil size={16} color={theme.colors.icon.secondary} />
          <Text.Body style={[styles.editText, { color: theme.colors.text.secondary }]}>Edit</Text.Body>
        </Pressable>
      </View>

      <View style={styles.players}>
        {item.players
          .slice()
          .sort((a, b) => a.depth - b.depth)
          .map((player) => {
            const isStarter = player.depth === 1;
            const rosterPlayer = roster.find(
              (item) => item.profileId === player.profileId,
            );
            const displayPlayer: DeptChartPlayer = {
              ...player,
              firstName: player.firstName ?? rosterPlayer?.firstName,
              lastName: player.lastName ?? rosterPlayer?.lastName,
              jerseyNumber: player.jerseyNumber ?? rosterPlayer?.jerseyNumber,
            };
            const imageUrl = rosterPlayer?.imageUrl;

            return (
              <View key={player.profileId} style={styles.playerRow}>
                <View style={styles.depthLabel}>
                  <View
                    style={[
                      styles.depthDot,
                      {
                        backgroundColor: isStarter
                          ? theme.colors.accent
                          : theme.colors.status.neutral,
                      },
                    ]}
                  />
                  <Text.Body style={[styles.depthText, { color: theme.colors.text.secondary }]}> 
                    {isStarter ? 'Starter' : `Backup ${player.depth - 1}`}
                  </Text.Body>
                </View>

                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: isStarter
                        ? theme.colors.segment.selectedBackground
                        : theme.colors.primary,
                    },
                  ]}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text.Body
                      style={{
                        color: isStarter
                          ? theme.colors.segment.selectedText
                          : theme.colors.auth.headerText,
                      }}
                    >
                      {getInitials(displayPlayer)}
                    </Text.Body>
                  )}
                </View>

                <Text.Subheading style={styles.playerName} numberOfLines={1}>
                  {displayPlayer.firstName || displayPlayer.lastName
                    ? `${displayPlayer.firstName ?? ''} ${displayPlayer.lastName ?? ''}`.trim()
                    : 'Player'}
                </Text.Subheading>
                <Text.Body style={[styles.jerseyNumber, { color: theme.colors.text.secondary }]}>
                  {displayPlayer.jerseyNumber !== undefined ? `#${displayPlayer.jerseyNumber}` : ''}
                </Text.Body>
              </View>
            );
          })}
      </View>
    </View>
  );

  const renderDeptChart = ({ item }: { item: DeptChart }) => {
    const positions = item.positions
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (positions.length === 0) {
      return (
        <View
          style={[
            styles.emptyChartCard,
            {
              backgroundColor: theme.colors.card.background,
              borderColor: theme.colors.card.border,
            },
          ]}
        >
          <Text.Subheading>{item.name}</Text.Subheading>
          <Text.Body variant="muted" style={styles.emptyMessage}>
            This depth chart has no positions yet. Add a position to start building the lineup.
          </Text.Body>
          <View style={styles.emptyChartActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.name}`}
              disabled={deletingChartId === item._id}
              onPress={() => handleDeleteChart(item)}
              style={({ pressed }) => [
                styles.deleteChartButton,
                {
                  backgroundColor: theme.colors.avatar.background,
                  opacity: pressed || deletingChartId === item._id ? 0.55 : 1,
                },
              ]}
            >
              <Trash2 size={17} color={theme.colors.error} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add a position to ${item.name}`}
              onPress={() => handleAddPosition(item)}
              style={({ pressed }) => [
                styles.addPositionButton,
                {
                  backgroundColor: theme.colors.avatar.background,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Plus size={19} color={theme.colors.icon.primary} />
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartPositions}>
        <View style={styles.chartActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item.name}`}
            disabled={deletingChartId === item._id}
            onPress={() => handleDeleteChart(item)}
            style={({ pressed }) => [
              styles.deleteChartButton,
              {
                backgroundColor: theme.colors.avatar.background,
                opacity: pressed || deletingChartId === item._id ? 0.55 : 1,
              },
            ]}
          >
            <Trash2 size={17} color={theme.colors.error} />
          </Pressable>

          <View style={styles.chartPrimaryActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Manage ${item.name}`}
              onPress={() => handleEditChart(item)}
              style={({ pressed }) => [
                styles.manageChartButton,
                {
                  backgroundColor: theme.colors.avatar.background,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Pencil size={16} color={theme.colors.icon.secondary} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add a position to ${item.name}`}
              onPress={() => handleAddPosition(item)}
              style={({ pressed }) => [
                styles.addPositionButton,
                {
                  backgroundColor: theme.colors.avatar.background,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Plus size={19} color={theme.colors.icon.primary} />
            </Pressable>
          </View>
        </View>
        {positions.map((position, index) => (
          <View key={position._id ?? `${item._id}-${position.name}-${index}`}>
            {renderPosition(position, item)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={deptCharts}
        keyExtractor={(item) => item._id}
        renderItem={renderDeptChart}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
        ListHeaderComponent={(
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {filters.map((filter) => {
              const isSelected = filter === selectedFilter;

              return (
                <Pressable
                  key={filter}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedFilter(filter)}
                  style={({ pressed }) => [
                    styles.tab,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.segment.selectedBackground
                        : theme.colors.segment.background,
                      borderColor: isSelected
                        ? theme.colors.accent
                        : theme.colors.segment.border,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text.Body
                    style={[
                      styles.tabText,
                      {
                        color: isSelected
                          ? theme.colors.segment.selectedText
                          : theme.colors.segment.text,
                      },
                    ]}
                  >
                    {filter}
                  </Text.Body>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
        ListEmptyComponent={isLoadingFilters || isLoadingCharts ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text.Subheading>No depth charts created</Text.Subheading>
            <Text.Body variant="muted" style={styles.emptyMessage}>
              Create your first depth chart to organize player positions and lineup order.
            </Text.Body>
          </View>
        )}
      />

      <AppSnackbar
        visible={snackbar.visible}
        variant="error"
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  tabs: {
    gap: 10,
    paddingBottom: 18,
  },
  tab: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardGap: {
    height: 16,
  },
  chartPositions: {
    gap: 16,
  },
  chartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartPrimaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manageChartButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  addPositionButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  deleteChartButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  emptyChartCard: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 18,
    borderWidth: 1,
  },
  emptyChartActions: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cardHeader: {
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  positionTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  positionBadge: {
    minWidth: 42,
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionCode: {
    fontSize: 14,
    fontWeight: '600',
  },
  positionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
  },
  players: {
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  playerRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  depthLabel: {
    width: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  depthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  depthText: {
    fontSize: 13,
    fontWeight: '600',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  jerseyNumber: {
    width: 42,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 72,
  },
  emptyMessage: {
    textAlign: 'center',
  },
});

export default DeptCharts;
