import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export const JsonColoredText: React.FC<{ data: any }> = ({ data }) => {
  if (typeof data !== "object" || data === null) {
    return <Text>{String(data)}</Text>;
  }

  return (
    <View>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={styles.jsonKey}>"{key}": </Text>
          <Text style={styles.jsonValue}>
            {typeof value === "object"
              ? JSON.stringify(value)
              : `"${String(value)}"`}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  jsonKey: {
    color: "#d73a49",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 12,
  },
  jsonValue: {
    color: "#032f62",
    fontSize: 12,
    flexShrink: 1,
  },
});
