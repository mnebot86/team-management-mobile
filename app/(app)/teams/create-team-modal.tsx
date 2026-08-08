import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { createTeam, type CreateTeamParams } from '@/api/teams';
import { getSports, type SportDefinition } from '@/api/sports';
import ScreenContainer from '@/components/layout/Screen';
import AppButton from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SnackBar from '@/components/ui/SnackBar';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

const CreateTeamModal = () => {
  const theme = useAppTheme();
  const [isLoadingSports, setIsLoadingSports] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [sports, setSports] = useState<SportDefinition[]>([]);
  const [sportId, setSportId] = useState('');
  const [sportVariantId, setSportVariantId] = useState('');
  const [error, setError] = useState('');

  const selectedSport = useMemo(
    () => sports.find((sport) => sport.id === sportId),
    [sportId, sports],
  );

  useEffect(() => {
    let isActive = true;

    getSports()
      .then((nextSports) => {
        if (!isActive) return;

        setSports(nextSports);
        const defaultSport = nextSports[0];

        if (defaultSport) {
          setSportId(defaultSport.id);
          setSportVariantId(defaultSport.defaultVariantId);
        }
      })
      .catch((requestError) => {
        if (!isActive) return;
        setError(requestError instanceof Error
          ? requestError.message
          : 'Failed to load supported sports.');
      })
      .finally(() => {
        if (isActive) setIsLoadingSports(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSportChange = (nextSportId: string) => {
    const sport = sports.find((item) => item.id === nextSportId);
    setSportId(nextSportId);
    setSportVariantId(sport?.defaultVariantId ?? '');
  };

  const handleCreateTeam = useCallback(async () => {
    if (!name.trim() || !ageGroup.trim() || !sportId || !sportVariantId) return;

    const payload: CreateTeamParams = {
      name: name.trim(),
      ageGroup: ageGroup.trim(),
      sportId,
      sportVariantId,
    };

    try {
      setIsCreating(true);
      await createTeam(payload);
      router.back();
    } catch (requestError) {
      setError(requestError instanceof Error
        ? requestError.message
        : 'Failed to create team.');
    } finally {
      setIsCreating(false);
    }
  }, [ageGroup, name, sportId, sportVariantId]);

  const isDisabled = isCreating
    || isLoadingSports
    || !name.trim()
    || !ageGroup.trim()
    || !sportId
    || !sportVariantId;

  return (
    <ScreenContainer.Scroll>
      <View style={styles.content}>
        <View style={[
          styles.section,
          { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
        ]}>
          <Text.Subheading>Team Details</Text.Subheading>
          <Input.Text
            label="Team Name"
            placeholder="Warriors"
            value={name}
            onChangeText={setName}
          />
          <Input.Text
            label="Age Group"
            placeholder="12U, Varsity, Adult"
            value={ageGroup}
            onChangeText={setAgeGroup}
          />
        </View>

        <View style={[
          styles.section,
          { backgroundColor: theme.colors.card.background, borderColor: theme.colors.card.border },
        ]}>
          <View style={styles.sectionHeading}>
            <Text.Subheading>Sport Setup</Text.Subheading>
            {isLoadingSports && <ActivityIndicator size="small" color={theme.colors.accent} />}
          </View>
          <Text.Body variant="muted">
            Your sport configures standard positions and depth charts automatically.
          </Text.Body>
          <Input.Select
            label="Sport"
            value={sportId}
            placeholder="Select a sport"
            options={sports.map((sport) => ({ label: sport.name, value: sport.id }))}
            onValueChange={handleSportChange}
          />
          <Input.Select
            label="Format"
            value={sportVariantId}
            placeholder="Select a format"
            options={(selectedSport?.variants ?? []).map((variant) => ({
              label: variant.name,
              value: variant.id,
            }))}
            onValueChange={setSportVariantId}
          />
        </View>

        <View style={styles.actions}>
          <AppButton
            variant="secondary"
            fullWidth={false}
            compact
            style={styles.actionButton}
            disabled={isCreating}
            onPress={() => router.back()}
          >
            Cancel
          </AppButton>
          <AppButton
            fullWidth={false}
            compact
            style={styles.actionButton}
            disabled={isDisabled}
            loading={isCreating}
            onPress={handleCreateTeam}
          >
            Create Team
          </AppButton>
        </View>
      </View>

      <SnackBar visible={Boolean(error)} variant="error" onDismiss={() => setError('')}>
        {error}
      </SnackBar>
    </ScreenContainer.Scroll>
  );
};

const styles = StyleSheet.create({
  content: { gap: 18, padding: 16, paddingBottom: 40 },
  section: { gap: 16, padding: 16, borderWidth: 1, borderRadius: 18 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1 },
});

export default CreateTeamModal;
