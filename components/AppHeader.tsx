import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import Text from '@/components/ui/Text';
import AppIcon from '@/components/AppIcon';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  backLabel?: string;
  onMenuPress?: () => void;
  onEditPress?: () => void;
  showMenuButton?: boolean;
  headerContent?: React.ReactNode;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  backLabel = 'Back',
  onMenuPress,
  onEditPress,
  headerContent,
}) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.screen.headerBackground }}>
      <View
        style={{
          padding: 12,
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
            <Text.Body style={{ color: theme.colors.text.primary }}>
              ← {backLabel}
            </Text.Body>
          </Pressable>
        )}

        {!!onEditPress && (
          <Pressable
            onPress={onEditPress}
            hitSlop={20}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
              padding: 6,
            }}
          >
            <AppIcon
              name="pencil"
              size={22}
            />
          </Pressable>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text.Heading style={{ color: theme.colors.text.primary }}>
            {title}
          </Text.Heading>

          {!!headerContent && (
            <View style={{ marginLeft: 12 }}>
              {headerContent}
            </View>
          )}
        </View>

        {subtitle && (
          <Text.Body
            style={{
              color: theme.colors.text.secondary,
              marginTop: 4,
            }}
          >
            {subtitle}
          </Text.Body>
        )}

        {!!onMenuPress && (
          <View style={{ marginTop: 12 }}>
            <Pressable
              onPress={onMenuPress}
              hitSlop={30}
            >
              <AppIcon
                name="menu"
                size={22}
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;
