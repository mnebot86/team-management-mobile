import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import { getTeamMember } from '@/api/teamMembers';
import SnackBar from '@/components/ui/SnackBar';

const PlayerDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const { playerId, teamId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      setIsLoading(true);

      if (!playerId || !teamId) {
        setError('Missing player or team information');
        return;
      }

      try {
        const response = await getTeamMember(teamId as string, playerId as string);

        setPlayer(response);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load player details';

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [playerId, teamId]);

  useEffect(() => {
    if (!player) return;

    navigation.setOptions({
      title: `${player.firstName} ${player.lastName}`,
    });
  }, [navigation, player]);

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
        <View style={styles.heroCard}>
          <View style={styles.avatarContainer}>
            {player?.avatar ? (
              <Image
                source={{ uri: player.avatar }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={54}
                color={theme.colors.outline}
              />
            )}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text.Heading style={styles.sectionTitle}>
            Player Information
          </Text.Heading>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>First Name</Text.Caption>
            <Text.Body>{player?.firstName || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Last Name</Text.Caption>
            <Text.Body>{player?.lastName || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Jersey Number</Text.Caption>
            <Text.Body>{player?.jerseyNumber || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Position</Text.Caption>
            <Text.Body>{player?.position || '--'}</Text.Body>
          </View>

          <View style={styles.infoRow}>
            <Text.Caption style={styles.label}>Status</Text.Caption>
            <Text.Body>
              {player?.isClaimed ? 'Claimed Account' : 'Unclaimed Player'}
            </Text.Body>
          </View>

          {!!player?.linkCode && (
            <View style={styles.infoRow}>
              <Text.Caption style={styles.label}>Link Code</Text.Caption>
              <Text.Body>{player.linkCode}</Text.Body>
            </View>
          )}
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
      paddingHorizontal: 16,
      gap: 20,
    },
    heroCard: {
      alignItems: 'center',
    },
    avatarContainer: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 32,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      gap: 18,
    },
    sectionTitle: {
      marginBottom: 4,
    },
    infoRow: {
      gap: 4,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    label: {
      color: colors.outline,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
  });

export default PlayerDetails;
