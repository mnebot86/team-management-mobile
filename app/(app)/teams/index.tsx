import React, { useState, useCallback } from 'react';
import { getSocket } from '@/socket';
import ScreenContainer from '@/components/layout/Screen';
import TeamCard from './components/teamCard';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getTeams } from '@/api/teams';
import AppSnackbar from '@/components/ui/SnackBar';
import { ITeam } from '@/types/team';
import { useTeamStore } from '@/hooks/useTeamStore';

const Teams = () => {
  const { setTeamId } = useTeamStore();
  const [teams, setTeams] = useState<{ team: ITeam }[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      const fetchTeams = async () => {
        try {
          const teams = await getTeams();

          setTeams(teams);
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : 'Failed to fetch teams';

          setSnackbar({
            visible: true,
            message,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchTeams();
    }, []),
  );

  const handleTeamSelect = ({ team }: { team: ITeam }) => {
    setTeamId(team._id);

    router.push({
      pathname: '/teams/team/[teamId]',
      params: {
        teamId: team._id,
      },
    });
  };

  return (
    <ScreenContainer>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item: any) => item.team._id}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          renderItem={({ item }) => (
            <TeamCard
              team={item.team}
              onPress={() => handleTeamSelect({ team: item.team })}
            />
          )}
        />
      )}

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

export default Teams;
