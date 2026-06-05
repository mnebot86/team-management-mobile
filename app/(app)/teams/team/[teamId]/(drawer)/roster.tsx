import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import { getTeamRoster } from '@/api/teamMembers';
import PlayerCard from '@/components/PlayerCard';

const Roster = () => {
  const { getTeamId } = useTeamStore();

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const teamId = getTeamId();

  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);

      try {
        const roster = await getTeamRoster(teamId as string);

        setRoster(roster);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load roster';

        setSnackbar({
          visible: true,
          message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRoster();
  }, [teamId]);

  const handleOpenModal = () => {
    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'No team selected',
      });

      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/create-player-modal',
      params: {
        teamId,
      },
    });
  }

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
        ListHeaderComponent={(
          <View style={{ marginBottom: 8 }}>
            <AppButton onPress={handleOpenModal}>
              Create Player
            </AppButton>
          </View>
        )}
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
