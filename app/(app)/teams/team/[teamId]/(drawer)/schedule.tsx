import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import { SectionList, View } from 'react-native';
import { router } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import EventCard from '@/components/EventCard';
import Text from '@/components/ui/Text';
import { useTheme } from 'react-native-paper';
import { getTeamSchedule } from '@/api/schedule';

const Schedule = () => {
  const { getTeamId } = useTeamStore();

  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  
  const teamId = getTeamId();

  useEffect(() => {
    const loadSchedule = async () => {
      if (!teamId) return;

      try {
        setLoading(true);

        const response = await getTeamSchedule(teamId);

        setSections(response ?? []);
      } catch (error) {
        setSnackbar({
          visible: true,
          message: 'Failed to load schedule',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
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
      pathname: '/(app)/teams/team/[teamId]/create-schedule-modal',
      params: {
        teamId,
      },
    });
  }

  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item) =>
          `${item.scheduleId ?? item._id}-${item.occurrenceStartDate ?? item.startDate}`
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        ListHeaderComponent={(
          <View style={{ marginBottom: 8 }}>
            <AppButton onPress={handleOpenModal}>
              New Event
            </AppButton>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            <Text.Caption
              style={{
                textTransform: 'uppercase',
                marginRight: 12,
                color: theme.colors.outline,
              }}
            >
              {section.title}
            </Text.Caption>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.colors.outlineVariant,
              }}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <EventCard
            data={item}
            onPress={() => console.log('Selected event:', item._id)}
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

export default Schedule;
