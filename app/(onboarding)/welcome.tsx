import React from "react";
import { View, Pressable } from "react-native";
import ScreenContainer from "@/components/layout/Screen";
import Text from "@/components/ui/Text";
import { useTheme } from "react-native-paper";
import AppIcon from "@/components/AppIcon";
import { router } from "expo-router";

const WelcomeScreen = () => {
  const theme = useTheme();

  return (
    <ScreenContainer>
      <View style={{ padding: 16, gap: 20 }}>
        <Pressable
          // onPress={() => router.push("/create-team")}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <View style={{ gap: 16 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: theme.colors.primary + "33",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppIcon name="account-group-outline" size={32} variant="accent" />
            </View>

            <View style={{ gap: 6 }}>
              <Text.Heading>Create a Team</Text.Heading>

              <Text.Body variant="muted">
                Start your own team and invite players
              </Text.Body>
            </View>
          </View>
        </Pressable>

        <Pressable
          // onPress={() => router.push("/join-team")}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <View style={{ gap: 16 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: theme.colors.surfaceVariant || "#eee",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppIcon name="account-plus-outline" size={32} variant="default" />
            </View>

            <View style={{ gap: 6 }}>
              <Text.Heading>Join a Team</Text.Heading>

              <Text.Body variant="muted">
                Enter a code to join an existing team
              </Text.Body>
            </View>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

export default WelcomeScreen;
