import React, { useEffect, useState, useCallback } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { router, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
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

  useFocusEffect(
    useCallback(() => {
      if (!teamId) return;

      setLoading(true);

      Promise.all([
        getTeam(teamId as string),
        getRosterCount(teamId as string),
        getNextPractice(teamId as string),
        getNextGame(teamId as string),
      ])
        .then(([team, roster, practice, game]) => {
          setTeam(team);
          setRosterCount(roster.count);
          setNextPractice(practice);
          setNextGame(game);
        })
        .catch((error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to load team data';

          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [teamId])
  );

  useEffect(() => {
    if (!team) return;

    navigation.setOptions({
      title: team.name,
      headerSubtitle: `${team.ageGroup} ${team.sport}`,
    });
  }, [navigation, team]);

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
