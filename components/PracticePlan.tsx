import React from 'react';
import { Pressable, View } from 'react-native';
import { Card, Chip, Divider } from 'react-native-paper';
import Text from '@/components/ui/Text';
import AppIcon from '@/components/AppIcon';
import { useAppTheme } from '@/hooks/useAppTheme';

export type PracticePlanCardProps = {
  data: {
    title: string;
    description?: string;
    totalDurationMinutes: number;
    sections?: {
      title: string;
    }[];
  };
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const PracticePlan = ({
  data,
  onPress,
  onEdit,
  onDelete,
}: PracticePlanCardProps) => {
  const theme = useAppTheme();

  const {
    title,
    description,
    totalDurationMinutes,
    sections = [],
  } = data;
  return (
    <Pressable onPress={onPress}>
      <Card
        style={{
          borderRadius: 24,
          marginBottom: 16,
          backgroundColor: theme.colors.card.background,
        }}
      >
        <Card.Content
          style={{
            paddingVertical: 20,
            gap: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme.colors.card.elevatedBackground,
                  marginRight: 16,
                }}
              >
                <AppIcon
                  name="clipboard-text-outline"
                  size={28}
                  variant="accent"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text.Heading>{title}</Text.Heading>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 6,
                    gap: 6,
                  }}
                >
                  <AppIcon
                    name="clock-outline"
                    size={18}
                  />
                  <Text.Body>{totalDurationMinutes} min</Text.Body>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
              }}
            >
              <Pressable onPress={onEdit}>
                <AppIcon
                  name="pencil-outline"
                  size={22}
                />
              </Pressable>

              <Pressable onPress={onDelete}>
                <AppIcon
                  name="trash-can-outline"
                  size={22}
                />
              </Pressable>
            </View>
          </View>

          {!!description && (
            <Text.Body>
              {description}
            </Text.Body>
          )}

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {sections.map((section, index) => (
              <Chip key={`${section.title}-${index}`} compact>
                {section.title}
              </Chip>
            ))}
          </View>

          <Divider style={{ backgroundColor: theme.colors.card.border }} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text.Muted>
              {sections.length} sections
            </Text.Muted>

            <Text.Muted>•</Text.Muted>

            <Text.Muted>
              {totalDurationMinutes} min total
            </Text.Muted>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};

export default PracticePlan;
