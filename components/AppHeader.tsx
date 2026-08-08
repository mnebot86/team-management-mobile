import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppIcon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Text from '@/components/ui/Text';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  backLabel?: string;
  onMenuPress?: () => void;
  onEditPress?: () => void;
  showMenuButton?: boolean;
  headerContent?: React.ReactNode;
  textInputProps?: React.ComponentProps<typeof Input.Text>;
};

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  backLabel = 'Back',
  onMenuPress,
  onEditPress,
  headerContent,
  textInputProps,
}) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: theme.colors.screen.headerBackground,
      }}
    >
      <View
        style={{
          padding: 12,
        }}
      >
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
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {!!onBackPress && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={backLabel}
                onPress={onBackPress}
                hitSlop={20}
                style={{ marginRight: 10, padding: 2 }}
              >
                <AppIcon name="arrow-left" size={24} />
              </Pressable>
            )}

            {!!onMenuPress && (
              <Pressable
                onPress={onMenuPress}
                hitSlop={20}
                style={{ marginRight: 10, padding: 2 }}
              >
                <AppIcon name="menu" size={24} />
              </Pressable>
            )}

            <View style={{ flex: 1 }}>
              <Text.Heading style={{ color: theme.colors.text.primary }}>
                {title}
              </Text.Heading>

              {subtitle && (
                <Text.Body
                  style={{
                    color: theme.colors.text.secondary,
                    marginTop: 2,
                  }}
                >
                  {subtitle}
                </Text.Body>
              )}
            </View>
          </View>

          {!!headerContent && (
            <View style={{ marginLeft: 12 }}>
              {headerContent}
            </View>
          )}
        </View>

        {textInputProps && (
          <View
            style={{
              marginTop: subtitle ? 16 : 12,
            }}
          >
            <Input.Text {...textInputProps} />
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

export default AppHeader;
