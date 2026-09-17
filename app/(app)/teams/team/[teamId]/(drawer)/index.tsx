import React, { useEffect, useState, useCallback } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { router, useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { getTeam } from '@/api/teams';
import { ITeam } from '@/types/team';
import SnackBar from '@/components/ui/SnackBar';
import { getRosterCount } from '@/api/teamMembers';
import LoadingScreen from '@/components/LoadingScreen';
import { View } from 'react-native';
import {
  getLastPractice,
  getNextGame,
  getNextPractice,
  getTeamAttendance,
  getTeamStats,
  ScheduleOccurrence,
} from '@/api/schedule';
import EventCard from '@/components/EventCard';
import { AttendanceCard } from '@/components/AttendenceCard';
import { WinLossRateCard } from '@/components/WinLossRateCard';
import { useScheduleInvalidationStore } from '@/hooks/useScheduleInvalidationStore';

const TeamDetails = () => {
  const navigation = useNavigation();
  const { teamId } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<ITeam | null>(null);
  const [nextPractice, setNextPractice] = useState<ScheduleOccurrence | null>(null);
  const [nextGame, setNextGame] = useState<ScheduleOccurrence | null>(null);
  const [, setLastPracticeAttendance] = useState({
    present: 0,
    absent: 0,
    total: 0,
  });
  const [overallAttendance, setOverallAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
  });

  const [teamStats, setTeamStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0,
    winRate: 0,
  });

  const [, setRosterCount] = useState(0);
  const [error, setError] = useState('');

  // Is this Needed?
  const invalidationVersion = useScheduleInvalidationStore(state =>
    typeof teamId === 'string' ? state.versions[teamId] ?? 0 : 0,
  );

  const handleOpenSchedule = useCallback((schedule: ScheduleOccurrence) => {
    if (!teamId || !schedule?.scheduleId) {
      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/schedule/[scheduleId]',
      params: {
        teamId: teamId as string,
        scheduleId: schedule.scheduleId,
        schedule: JSON.stringify(schedule),
      },
    });
  }, [teamId]);

  const loadTeamDetails = useCallback(() => {
    if (!teamId) return;

    setLoading(true);

    Promise.all([
      getTeam(teamId as string),
      getRosterCount(teamId as string),
      getNextPractice(teamId as string),
      getNextGame(teamId as string),
      getLastPractice(teamId as string),
      getTeamAttendance(teamId as string),
      getTeamStats(teamId as string),
    ])
      .then(([team, roster, practice, game, lastPractice, attendance, stats]) => {
        setTeam(team);
        setRosterCount(roster.count);
        setNextPractice(practice);
        setNextGame(game);
        setLastPracticeAttendance(lastPractice);
        setOverallAttendance({
          present: attendance.present,
          late: attendance.late,
          absent: attendance.absent,
          total: attendance.total,
        });
        setTeamStats(stats);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error
          ? error.message
          : 'Failed to load team data';

        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teamId]);

  useFocusEffect(
    useCallback(() => {
      loadTeamDetails();
    }, [loadTeamDetails])
  );

  useEffect(() => {
    if (invalidationVersion > 0) loadTeamDetails();
  }, [invalidationVersion, loadTeamDetails]);

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
    <ScreenContainer.Scroll>
      <View style={{ padding: 16, gap: 24 }}>
        {nextGame ? (
          <View>
            <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
              Upcoming Game
            </Text.Caption>

            {nextGame && (
              <EventCard
                data={nextGame}
                onPress={() => handleOpenSchedule(nextGame)}
              />
            )}
          </View>
        ) : null}

        {nextPractice ? (
          <View>
            <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
              Upcoming Practice
            </Text.Caption>

            {nextPractice && (
              <EventCard
                data={nextPractice}
                onPress={() => handleOpenSchedule(nextPractice)}
              />
            )}
          </View>
        ) : null}

        <View>
          <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
            Overall Attendance
          </Text.Caption>

          <AttendanceCard
            present={overallAttendance.present}
            late={overallAttendance.late}
            absent={overallAttendance.absent}
            total={overallAttendance.total}
          />
        </View>

        <View>
          <Text.Caption style={{ textTransform: 'uppercase', marginBottom: 8 }}>
            Win Loss Rate
          </Text.Caption>

          <WinLossRateCard
            wins={teamStats.wins}
            losses={teamStats.losses}
            draws={teamStats.draws}
            total={teamStats.total}
          />
        </View>
      </View>

      {!!error && (
        <SnackBar
          visible={true}
          onDismiss={() => setError('')}>
          {error}
        </SnackBar>
      )}
    </ScreenContainer.Scroll>
  );
};

export default TeamDetails;
