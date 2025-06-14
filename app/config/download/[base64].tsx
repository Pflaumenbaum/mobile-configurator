import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

import { useDetectAppleDevice } from "@/hooks/useDetectAppleDevice";
import { installMobileConfig } from "@/utils/install";
import base64 from "react-native-base64";
const Page = () => {
  const params = useLocalSearchParams<{ base64: string }>();
  const isAppleDevice = useDetectAppleDevice();
  const theme = useTheme();

  const handlePress = () => {
    const config = base64.decode(params.base64 || "");
    installMobileConfig(config);
  };

  const instructions = `After downloading you’ll see the message "Profile Downloaded"".
To install the profile, follow these steps:

1. Open the Settings app.
2. Tap "Profile Downloaded"
3. Tap "Install" in the upper-right corner, then follow the onscreen instructions.`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Card style={{ padding: 20, alignItems: "center", margin: 15 }}>
          <Text variant="headlineMedium" style={{ textAlign: "center" }}>
            {isAppleDevice
              ? "Install Config to Your Device"
              : "Download Configuration File"}
          </Text>

          <Text
            variant="bodyMedium"
            style={{ marginTop: 10, textAlign: "center" }}
          >
            {isAppleDevice
              ? "Click the button below to install the configuration profile on your device."
              : "Click the button below to download the configuration file."}
          </Text>

          {isAppleDevice && (
            <Text
              variant="bodySmall"
              style={{
                marginTop: 10,
                color: theme.colors.error,
                textAlign: "left",
              }}
            >
              {instructions}
            </Text>
          )}

          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={handlePress}
          >
            {isAppleDevice ? "Install Profile" : "Download Mobileconfig"}
          </Button>
        </Card>
      </View>
    </>
  );
};

export default Page;
