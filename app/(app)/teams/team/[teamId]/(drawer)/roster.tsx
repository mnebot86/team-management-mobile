import React, { useState, useCallback } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import { FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import { getTeamRoster } from '@/api/teamMembers';
import PlayerCard from '@/components/PlayerCard';
import SegmentBar from '@/components/ui/SegmentBar';
import type { SegmentOption } from '@/components/ui/SegmentBar';

type RosterFilter = 'all' | 'player' | 'coach';

const rosterFilters: SegmentOption<RosterFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'player', label: 'Players' },
  { value: 'coach', label: 'Coaches' },
];

const Roster = () => {
  const { getTeamId } = useTeamStore();

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<RosterFilter>('all');
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const teamId = getTeamId();

  useFocusEffect(
    useCallback(() => {
      if (!teamId) {
        return;
      }

      let isActive = true;
      setLoading(true);

      const fetchRoster = async () => {
        try {
          const roster = await getTeamRoster(
            teamId as string,
            filter === 'all' ? undefined : filter,
          );

          if (isActive) {
            setRoster(roster);
          }
        } catch (err: any) {
          if (!isActive) {
            return;
          }

          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load roster';

          setSnackbar({
            visible: true,
            message,
          });
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchRoster();

      return () => {
        isActive = false;
      };
    }, [filter, teamId]),
  );

  const handleSelectPlayer = (item: any) => {
    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'No team selected',
      });

      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/player/[playerId]',
      params: {
        teamId,
        playerId: item.profileId,
      },
    });
  };

  return (
    <ScreenContainer>
      <FlatList
        data={roster}
        keyExtractor={(item: any) => item.profileId}
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
        ListHeaderComponent={
          <SegmentBar
            value={filter}
            onValueChange={setFilter}
            options={rosterFilters}
            style={{ marginBottom: 8 }}
          />
        }
        renderItem={({ item }) => (
          <PlayerCard
            firstName={item.firstName}
            lastName={item.lastName}
            jerseyNumber={item.jerseyNumber}
            positions={item.positions}
            age={item.age}
            imageUrl={item.imageUrl}
            onPress={() => handleSelectPlayer(item)}
          />
        )}
      />

      <AppSnackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        variant="error"
      >
        {snackbar.message}
      </AppSnackbar>
    </ScreenContainer>
  );
};

export default Roster;
