import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type ContentUnavailableProps = {
  icon: string;
  title: string;
  description: string;
};

const ContentUnavailable: React.FC<ContentUnavailableProps> = ({
  icon,
  title,
  description,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <MaterialIcons
        size={50}
        style={styles.icon}
        color={colors.primary}
        name={icon as any}
      />

      <Text
        variant="titleMedium"
        style={[styles.title, { color: colors.onSurface }]}
      >
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.description, { color: colors.onBackground }]}
      >
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
  },
});

export default ContentUnavailable;
