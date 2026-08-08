import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SnackBar from '@/components/ui/SnackBar';
import AvatarPicker, { AvatarFile } from '@/components/avatar/AvatarPicker';
import Text from '@/components/ui/Text';
import { editTeamMember, getTeamMember } from '@/api/teamMembers';
import { getTeam } from '@/api/teams';
import { getSport, type SportPositionDefinition } from '@/api/sports';

const EditPlayerScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { teamId, playerId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [positionIds, setPositionIds] = useState<string[]>([]);
  const [availablePositions, setAvailablePositions] = useState<SportPositionDefinition[]>([]);
  const [avatar, setAvatar] = useState<AvatarFile>();
  const [avatarPublicId, setAvatarPublicId] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchPlayer = async () => {
        setIsLoading(true);

        if (!teamId || !playerId) {
          setError('Missing player information');
          setIsLoading(false);
          return;
        }

        try {
          const [player, team] = await Promise.all([
            getTeamMember(teamId as string, playerId as string),
            getTeam(teamId as string),
          ]);
          const sport = await getSport(team.sportId || 'football');
          const variant = sport.variants.find(
            (item) => item.id === (team.sportVariantId || sport.defaultVariantId),
          );
          const positions = variant?.positions ?? [];
          const playerPositionLabels = Array.isArray(player?.positions)
            ? player.positions.filter((value: unknown) => typeof value === 'string' && value.trim() !== '')
            : typeof player?.positions === 'string'
              ? player.positions.split(',').map((value: string) => value.trim()).filter(Boolean)
              : [];

          setFirstName(player?.firstName || '');
          setLastName(player?.lastName || '');
          setJerseyNumber(player?.jerseyNumber?.toString() || '');
          setAvailablePositions(positions);
          setPositionIds(
            player?.positionIds?.length
              ? player.positionIds
              : positions
                .filter((position) => playerPositionLabels.some(
                  (value: string) => value.toLowerCase() === position.name.toLowerCase()
                    || value.toLowerCase() === position.shortName.toLowerCase(),
                ))
                .map((position) => position.id),
          );

          if (player?.avatar) {
            setAvatar(player.avatar);
            setAvatarPublicId(player.avatar.publicId || '');
          }
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to load player';

          setError(message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlayer();
    }, [teamId, playerId]),
  );

  const handleSave = async () => {
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        firstName,
        lastName,
        jerseyNumber,
        positionIds,
        avatar,
        avatarPublicId,
      };

      await editTeamMember(payload, teamId as string, playerId as string);

      router.back();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update player';

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer.Centered>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </ScreenContainer.Centered>
    );
  }

  return (
    <ScreenContainer.Scroll>
      <View style={styles.container}>
        <View style={styles.formCard}>
          <AvatarPicker
            value={avatar}
            onChange={setAvatar}
            size={140}
          />

          <Input.Text
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Input.Text
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Input.Text
            label="Jersey Number"
            value={jerseyNumber}
            onChangeText={setJerseyNumber}
            keyboardType="numeric"
          />

          <View style={styles.positionSection}>
            <View>
              <Text.Label>Positions</Text.Label>
            </View>
            <View style={styles.positionGroups}>
              {[...new Set(availablePositions.map((position) => position.group))]
                .map((group) => (
                  <View key={group} style={styles.positionGroup}>
                    <Text.Caption>{group}</Text.Caption>
                    <View style={styles.positionOptions}>
                      {availablePositions
                        .filter((position) => position.group === group)
                        .map((position) => {
                          const selected = positionIds.includes(position.id);

                          return (
                            <Pressable
                              key={position.id}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: selected }}
                              onPress={() => setPositionIds((current) =>
                                selected
                                  ? current.filter((id) => id !== position.id)
                                  : [...current, position.id],
                              )}
                              style={[
                                styles.positionOption,
                                {
                                  backgroundColor: selected
                                    ? theme.colors.secondaryContainer
                                    : theme.colors.surfaceVariant,
                                  borderColor: selected
                                    ? theme.colors.primary
                                    : theme.colors.outlineVariant,
                                },
                              ]}
                            >
                              <Text.Label style={{
                                color: selected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
                              }}>
                                {position.shortName}
                              </Text.Label>
                            </Pressable>
                          );
                        })}
                    </View>
                  </View>
                ))}
            </View>
          </View>

          <Button
            loading={isSaving}
            onPress={handleSave}>
            Save Changes
          </Button>
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

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 20,
    },
    headerSection: {
      gap: 6,
    },
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      gap: 18,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    positionSection: {
      gap: 10,
    },
    positionGroups: {
      gap: 14,
    },
    positionGroup: {
      gap: 8,
    },
    positionOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    positionOption: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderRadius: 999,
    },
  });

export default EditPlayerScreen;
