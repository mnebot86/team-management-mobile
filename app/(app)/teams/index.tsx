import React, { useState, useCallback, useEffect } from 'react';
import { getSocket } from '@/socket';
import ScreenContainer from '@/components/layout/Screen';
import TeamCard from './components/teamCard';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getTeams } from '@/api/teams';
import AppSnackbar from '@/components/ui/SnackBar';
import { ITeam } from '@/types/team';
import { useTeamStore } from '@/hooks/useTeamStore';
import AppIcon from '@/components/AppIcon';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

const Teams = () => {
  const theme = useAppTheme();
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
          const teamsResponse = await getTeams();
          const teams = Array.isArray(teamsResponse)
            ? teamsResponse
            : Array.isArray(teamsResponse?.data)
              ? teamsResponse.data
              : [];

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

  useEffect(() => {
    try {
      const socket = getSocket();

      const handleTeamCreated = (team: ITeam) => {
        setTeams((current) => [
          { team },
          ...current.filter(({ team: existing }) => existing._id !== team._id),
        ]);
      };

      socket.on('team.created', handleTeamCreated);

      return () => {
        socket.off('team.created', handleTeamCreated);
      };
    } catch {
      return;
    }
  }, []);

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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppIcon
                name="account-group-outline"
                size={72}
                variant="default"
              />
              <Text.Heading>
                No Teams Yet
              </Text.Heading>

              <Text.Body style={[
                styles.emptyText,
                { color: theme.colors.onSurfaceVariant },
              ]}>
                Create your first team or join an existing team using an invite code.
              </Text.Body>
            </View>
          }
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

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});
