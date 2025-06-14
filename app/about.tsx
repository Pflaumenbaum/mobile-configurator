import { goBack } from "@/utils/router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button, Divider, IconButton, Text, useTheme } from "react-native-paper";

const AboutPage = () => {
  const theme = useTheme();

  const handleGitHubPress = () => {
    Linking.openURL("https://github.com/Pflaumenbaum/mobile-configurator");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <IconButton onPress={() => goBack()} style={{position: "absolute", top: 10, left: 10}} icon={() => <MaterialIcons name="arrow-back" size={25} color={theme.colors.onBackground} />}/>
      <Text variant="headlineMedium" style={styles.title}>
        MobileConfig<Text variant="labelLarge">urator</Text>
      </Text>
      <Text style={styles.version}>Version 1.0.0</Text>

      <Divider style={styles.divider} />

      <Text style={styles.text}>© 2025 Pflaumenbaum. </Text>
      <Text style={styles.text}>Licensed under the MIT License.</Text>

      <Button
        mode="outlined"
        icon={() => (
          <MaterialCommunityIcons
            name="github"
            size={20}
            color={theme.colors.primary}
          />
        )}
        style={styles.button}
        onPress={handleGitHubPress}
      >
        View on GitHub
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
  divider: {
    width: "80%",
    marginVertical: 16,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
});

export default AboutPage;
