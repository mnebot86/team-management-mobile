import React, { useCallback, useState } from 'react';
import ScreenContainer from '@/components/layout/Screen';
import { FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AppSnackbar from '@/components/ui/SnackBar';
import { useTeamStore } from '@/hooks/useTeamStore';
import PracticePlan from '@/components/PracticePlan';
import { deletePracticePlan, getPracticePlans } from '@/api/practices';

const Plans = () => {
  const { getTeamId } = useTeamStore();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const teamId = getTeamId();

  useFocusEffect(
    useCallback(() => {
      const fetchPlans = async () => {
        if (!teamId) {
          return;
        }

        setLoading(true);

        try {
          const plans = await getPracticePlans(teamId);

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
      };

      fetchPlans();
    }, [teamId]),
  );

  const handleSelectPlan = useCallback((item: any) => {
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
  }, [router, teamId]);

  const handleEdit = useCallback((item: any) => {
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
  }, [router, teamId]);

  const handleDelete = useCallback(async (item: any) => {
    try {
      await deletePracticePlan(item._id);

      setPlans((current) =>
        current.filter((plan: any) => plan._id !== item._id)
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete practice plan';

      setSnackbar({
        visible: true,
        message,
      });
    }
  }, []);

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
            onDelete={() => handleDelete(item)}
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
