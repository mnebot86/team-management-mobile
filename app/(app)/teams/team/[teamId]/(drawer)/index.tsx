import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { getTeam } from '@/api/teams';
import { ITeam } from '@/types/team';
import SnackBar from '@/components/ui/SnackBar';
import { getRosterCount } from '@/api/teamMembers';
import { Card, Divider } from 'react-native-paper';
import LoadingScreen from '@/components/LoadingScreen';
import { View } from 'react-native';
import { getNextGame, getNextPractice } from '@/api/schedule';
import EventCard from '@/components/EventCard';

const TeamDetails = () => {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<ITeam | null>(null);
  const [nextPractice, setNextPractice] = useState<any>(null);
  const [nextGame, setNextGame] = useState<any>(null);
  const [rosterCount, setRosterCount] = useState(0);
  const [error, setError] = useState('');

  const handleOpenSchedule = () => {
    if (!teamId) {
      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/(drawer)/schedule',
      params: {
        teamId: teamId as string,
      },
    });
  };

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
      if (!teamId) return;

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

  useEffect(() => {
    const fetchNextPractice = async () => {
      setLoading(true);

      try {
        const practice = await getNextPractice(teamId as string);

        setNextPractice(practice);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load next game';

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchNextPractice();
  }, [teamId]);

  useEffect(() => {
    const fetchNextGame = async () => {
      setLoading(true);

      try {
        const game = await getNextGame(teamId as string);

        setNextGame(game);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load next practice';

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchNextGame();
  }, [teamId]);

  if (loading) {
    return <LoadingScreen message="Loading team dashboard..." />;
  }

  return (
    <ScreenContainer>
      <View style={{ padding: 16, gap: 24 }}>
        <View>
          <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
            Upcoming Practice
          </Text.Caption>

          {nextPractice && (
            <EventCard
              data={nextPractice}
              onPress={handleOpenSchedule}
            />
          )}

          {!nextPractice && (
            <Text.Muted>No upcoming practice scheduled.</Text.Muted>
          )}
        </View>

        <View>
          <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
            Upcoming Game
          </Text.Caption>

          {nextGame && (
            <EventCard
              data={nextGame}
              onPress={handleOpenSchedule}
            />
          )}

          {!nextGame && (
            <Text.Muted>No upcoming game scheduled.</Text.Muted>
          )}
        </View>

        <Card style={{ borderRadius: 24 }}>
          <Card.Content>
            <Text.Subheading>Team Snapshot</Text.Subheading>

            <Divider style={{ marginVertical: 12 }} />

            <Text.Body>Players: {rosterCount}</Text.Body>
            <Text.Body>Upcoming Practices: 3</Text.Body>
            <Text.Body>Upcoming Games: 2</Text.Body>
          </Card.Content>
        </Card>
      </View>

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
