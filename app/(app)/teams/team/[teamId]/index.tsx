import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getTeam } from '@/api/teams';
import { ITeam } from '@/types/team';

const TeamDetails = () => {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<ITeam | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);

      try {
        const resp = await getTeam(teamId as string)

        setTeam(resp);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  useEffect(() => {
    if (!team) return;

    navigation.setOptions({
      title: team.name,
      headerSubtitle: `${team.ageGroup} ${team.sport}`,
    });
  }, [navigation, team]);

  return (
    <ScreenContainer>
      <Text.Heading>Roster</Text.Heading>
      <Text.Heading>Next Practice Plan</Text.Heading>
      <Text.Heading>Weather Alerts</Text.Heading>
      <Text.Heading>Next Game</Text.Heading>
      <Text.Heading>Game Plan Notes</Text.Heading>
      <Text.Heading>Practice Attendance</Text.Heading>
    </ScreenContainer>
  );
};

export default TeamDetails;
