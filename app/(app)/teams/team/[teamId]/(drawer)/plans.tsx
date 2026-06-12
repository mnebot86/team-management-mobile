import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import PracticePlan from '@/components/PracticePlan';
import { getPracticePlans } from '@/api/practices';

const Plans = () => {
  const { getTeamId } = useTeamStore();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const teamId = getTeamId();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);

      try {
        const plans = await getPracticePlans(teamId as string);

        setPlans(plans);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load plans';

        setSnackbar({
          visible: true,
          message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [teamId]);

  const handleCreatePlan = () => {
    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'No team selected',
      });

      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/create-plan-modal',
      params: {
        teamId: teamId,
      },
    });
  };

  const handleSelectPlan = (item: any) => {
    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'No team selected',
      });

      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/plan/[planId]',
      params: {
        teamId,
        planId: item._id,
        plan: JSON.stringify(item),
      },
    });
  };

  const handleEdit = (item: any) => {
    if (!teamId) {
      setSnackbar({
        visible: true,
        message: 'No team selected',
      });

      return;
    }

    router.push({
      pathname: '/(app)/teams/team/[teamId]/edit-plan-modal',
      params: {
        teamId: teamId,
        planId: item._id,
        plan: JSON.stringify(item),
      },
    });
  };

  return (
    <ScreenContainer>
      <FlatList
        data={plans}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
        renderItem={({ item }) => (
          <PracticePlan
            data={item}
            onPress={() => handleSelectPlan(item)}
            onEdit={() => handleEdit(item)}
            onDelete={() => console.log('Delete plan', item._id)}
          />
        )}
        refreshing={loading}
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

export default Plans;
