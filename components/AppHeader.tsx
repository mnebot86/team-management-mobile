import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import Text from '@/components/ui/Text';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  backLabel?: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  backLabel = 'Back',
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.primary }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        {onBackPress && (
          <Pressable
            onPress={onBackPress}
            hitSlop={20}
            style={{
              alignSelf: 'flex-start',
              paddingVertical: 6,
              paddingHorizontal: 4,
              marginBottom: 8,
            }}
          >
            <Text.Body variant="accent">← {backLabel}</Text.Body>
          </Pressable>
        )}

        <Text.Heading style={{ color: theme.colors.onPrimary }}>
          {title}
        </Text.Heading>

        {subtitle && (
          <Text.Body
            style={{
              color: theme.colors.onPrimary,
              opacity: 0.7,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text.Body>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;
