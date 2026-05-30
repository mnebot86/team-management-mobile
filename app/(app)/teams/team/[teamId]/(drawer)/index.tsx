import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTeam } from '@/api/teams';
import { ITeam } from '@/types/team';
import SnackBar from '@/components/ui/SnackBar';
import { getRosterCount } from '@/api/teamMembers';

const TeamDetails = () => {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<ITeam | null>(null);
  const [rosterCount, setRosterCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);

      try {
        const resp = await getTeam(teamId as string)

        setTeam(resp);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load team details';

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [teamId]);

  useEffect(() => {
    if (!team) return;

    navigation.setOptions({
      title: team.name,
      headerSubtitle: `${team.ageGroup} ${team.sport}`,
    });
  }, [navigation, team]);

  useEffect(() => {
    const fetchRosterCount = async () => {
      if (team) return;

      try {
        const result = await getRosterCount(teamId as string);

        setRosterCount(result.count);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load roster count';

        setError(message);
      }
    }

    fetchRosterCount();
  }, [teamId, team]);

  return (
    <ScreenContainer>
      <Text.Heading>Roster {rosterCount}</Text.Heading>
      <Text.Heading>Next Practice Plan</Text.Heading>
      <Text.Heading>Weather Alerts</Text.Heading>
      <Text.Heading>Next Game</Text.Heading>
      <Text.Heading>Game Plan Notes</Text.Heading>
      <Text.Heading>Practice Attendance</Text.Heading>
      {!!error && (
        <SnackBar
          visible={true}
          onDismiss={() => setError('')}
        >
          {error}
        </SnackBar>
      )}
    </ScreenContainer>
  );
};

export default TeamDetails;
