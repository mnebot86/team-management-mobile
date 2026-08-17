import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Eye, X } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFootballFormationCoordinates } from '@/utils/footballFormation';

import {
  getDeptChartFilters,
  getDeptCharts,
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
  jerseyNumber?: string | number;
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
  const safeAreaInsets = useSafeAreaInsets();
  const teamId = useTeamStore((state) => state.getTeamId());

  const [filters, setFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [deptCharts, setDeptCharts] = useState<DeptChart[]>([]);
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [viewingChart, setViewingChart] = useState<DeptChart>();
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

  const renderPosition = (item: DeptChartPosition) => (
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
            This formation does not have any positions.
          </Text.Body>
        </View>
      );
    }

    return (
      <View style={styles.chartPositions}>
        {/* <View style={styles.chartActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name} formation`}
            onPress={() => setViewingChart(item)}
            style={({ pressed }) => [
              styles.viewChartButton,
              {
                backgroundColor: theme.colors.avatar.background,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Eye size={19} color={theme.colors.icon.primary} />
            <Text.Body style={styles.viewChartText}>View formation</Text.Body>
          </Pressable>
        </View> */}

        {positions.map((position, index) => (
          <View key={position._id ?? `${item._id}-${position.name}-${index}`}>
            {renderPosition(position)}
          </View>
        ))}
      </View>
    );
  };

  const closeFormation = () => setViewingChart(undefined);
  const viewingPositions = viewingChart?.positions
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const formationCoordinates = getFootballFormationCoordinates(viewingPositions);

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

      <Modal
        visible={Boolean(viewingChart)}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeFormation}
      >
        <SafeAreaView
          edges={['top', 'bottom', 'left', 'right']}
          style={[styles.viewer, { backgroundColor: theme.colors.screen.background }]}
        >
          <View style={[styles.viewerHeader, { top: safeAreaInsets.top + 10 }]}>
            <View style={styles.viewerTitleContainer}>
              <Text.Subheading numberOfLines={1} style={styles.viewerTitle}>
                {viewingChart?.name ?? 'Formation'}
              </Text.Subheading>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close formation view"
              hitSlop={12}
              onPress={closeFormation}
              style={({ pressed }) => [
                styles.closeViewerButton,
                {
                  backgroundColor: theme.colors.avatar.background,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={24} color={theme.colors.icon.primary} />
            </Pressable>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.footballField}>
              {Array.from({ length: 9 }, (_, index) => (
                <View
                  key={index}
                  style={[styles.yardLine, { top: `${10 + index * 10}%` }]}
                />
              ))}
              <View style={styles.lineOfScrimmage} />

              {viewingPositions.map((position, positionIndex) => {
                const coordinate = formationCoordinates.get(position) ?? { x: 50, y: 50 };
                const player = position.players.slice().sort((a, b) => a.depth - b.depth)[0];
                const rosterPlayer = roster.find((item) => item.profileId === player?.profileId);

                const displayPlayer: DeptChartPlayer | undefined = player ? {
                  ...player,
                  firstName: player.firstName ?? rosterPlayer?.firstName,
                  lastName: player.lastName ?? rosterPlayer?.lastName,
                  jerseyNumber: player.jerseyNumber ?? rosterPlayer?.jerseyNumber,
                } : undefined;

                return (
                  <View
                    key={position._id ?? `${position.name}-${positionIndex}`}
                    style={[
                      styles.fieldPlayer,
                      { left: `${coordinate.x}%`, top: `${coordinate.y}%` },
                    ]}
                  >
                    <View style={[styles.fieldAvatarRing, { borderColor: theme.colors.accent }]}>
                      <View style={[styles.fieldAvatar, { backgroundColor: theme.colors.card.background }]}>
                        {rosterPlayer?.imageUrl ? (
                          <Image source={{ uri: rosterPlayer.imageUrl }} style={styles.avatarImage} />
                        ) : (
                          <Text.Body style={styles.fieldInitials}>
                            {displayPlayer?.jerseyNumber !== undefined
                              ? `#${displayPlayer.jerseyNumber}`
                              : displayPlayer ? getInitials(displayPlayer) : position.shortName}
                          </Text.Body>
                        )}
                      </View>
                    </View>

                    <View style={styles.fieldPlayerLabel}>
                      <Text.Caption style={styles.fieldPositionText}>{position.shortName}</Text.Caption>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    justifyContent: 'flex-end',
  },
  viewChartButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  viewChartText: {
    fontSize: 14,
    fontWeight: '600',
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
  viewer: {
    flex: 1,
  },
  viewerHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewerTitleContainer: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(18,25,32,0.88)',
  },
  viewerTitle: {
    color: '#FFFFFF',
  },
  closeViewerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    borderRadius: 22,
  },
  fieldContainer: {
    flex: 1,
  },
  footballField: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#202932',
  },
  yardLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#3B4651',
  },
  lineOfScrimmage: {
    position: 'absolute',
    top: '56%',
    left: '8%',
    right: '8%',
    height: 3,
    backgroundColor: '#92A0AC',
  },
  fieldPlayer: {
    width: 52,
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -26 }, { translateY: -23 }],
  },
  fieldAvatarRing: {
    width: 42,
    height: 42,
    padding: 2,
    borderRadius: 21,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  fieldAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
  fieldInitials: {
    fontSize: 10,
    fontWeight: '800',
  },
  fieldPlayerLabel: {
    minWidth: 34,
    alignItems: 'center',
    marginTop: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(12,17,22,0.92)',
  },
  fieldPositionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

export default DeptCharts;
