import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, Divider, useTheme } from 'react-native-paper';

import ScreenContainer from '@/components/layout/Screen';
import Text from '@/components/ui/Text';
import AppIcon from '@/components/AppIcon';

const PlanDetailScreen = () => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const { plan } = useLocalSearchParams<{
    teamId: string;
    planId: string;
    plan?: string;
  }>();

  const planData = useMemo(() => {
    if (!plan) {
      return null;
    }

    try {
      return JSON.parse(plan);
    } catch {
      return null;
    }
  }, [plan]);

  const title = planData?.title ?? 'Practice Plan';
  const description = planData?.description ?? 'No description added yet.';
  const totalDurationMinutes = planData?.totalDurationMinutes ?? 0;
  const sections = [...(planData?.sections ?? [])].sort(
    (first, second) => (first.order ?? 0) - (second.order ?? 0)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 20,
        }}
      >
        <Card
          style={{
            borderRadius: 24,
          }}
        >
          <Card.Content
            style={{
              paddingVertical: 22,
              gap: 16,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text.Heading>{title}</Text.Heading>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <AppIcon
                  name="clock-outline"
                  size={22}
                />
                <Text.Body>{totalDurationMinutes} min</Text.Body>
              </View>
            </View>

            <Text.Body>{description}</Text.Body>

            <Divider />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Text.Muted>{sections.length} sections</Text.Muted>
              <Text.Muted>•</Text.Muted>
              <Text.Muted>{totalDurationMinutes} min total</Text.Muted>
            </View>
          </Card.Content>
        </Card>

        <Text.Caption
          style={{
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: theme.colors.outline,
          }}
        >
          Sections
        </Text.Caption>

        {sections.map((section, index) => (
          <Pressable
            key={section._id ?? `${section.title}-${index}`}
            onPress={() => toggleSection(section._id ?? `${index}`)}
          >
            <Card
              style={{
                borderRadius: 20,
              }}
            >
              <Card.Content
                style={{
                  paddingVertical: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.colors.secondaryContainer,
                    }}
                  >
                    <Text.Body
                      style={{
                        color: theme.colors.onSecondaryContainer,
                        fontWeight: '700',
                      }}
                    >
                      {index + 1}
                    </Text.Body>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text.Subheading>{section.title}</Text.Subheading>
                    {!expandedSections.includes(section._id ?? `${index}`) && !!section.description && (
                      <Text.Muted>{section.description}</Text.Muted>
                    )}
                  </View>

                  <Text.Muted>{section.durationMinutes} min</Text.Muted>

                  <AppIcon
                    name={expandedSections.includes(section._id ?? `${index}`) ? 'chevron-up' : 'chevron-down'}
                    size={24}
                  />
                </View>

                {expandedSections.includes(section._id ?? `${index}`) && (
                  <>
                    <Divider style={{ marginVertical: 16 }} />

                    <View
                      style={{
                        paddingLeft: 62,
                        gap: 12,
                      }}
                    >
                      <Text.Body>{section.description}</Text.Body>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <AppIcon
                          name="clock-outline"
                          size={18}
                        />
                        <Text.Muted>{section.durationMinutes} min</Text.Muted>
                      </View>
                    </View>
                  </>
                )}
              </Card.Content>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

export default PlanDetailScreen;
