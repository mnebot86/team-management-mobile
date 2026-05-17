import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import TeamCard from './components/teamCard';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import { getTeams } from '@/api/teams';
import AppSnackbar from '@/components/ui/SnackBar';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(() => {
    setLoading(true);

    const fetchTeams = async () => {
      try {
        const teams = await getTeams();

        console.log(teams);

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
  }, []);

  const handleOpenModal = () => {
    router.push('/(app)/teams/create-team-modal');
  }

  return (
    <ScreenContainer>

      <FlatList
        data={teams}
        keyExtractor={(item: any) => item.team._id}
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
        ListHeaderComponent={(
          <View style={{ marginBottom: 8 }}>
            <AppButton onPress={handleOpenModal}>
              Create Team
            </AppButton>
          </View>
        )}
        renderItem={({ item }) => (
          <TeamCard team={item.team} />
        )}
      // ListEmptyComponent={(
      //   <View style={{ paddingVertical: 40 }}>
      //     <TeamCard empty />
      //   </View>
      // )}
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

export default Teams;
