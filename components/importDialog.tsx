import PayloadDataTableModal from "@/components/payloadSelector";
import { useParsedPlist } from "@/hooks/useParsedPlist";
import { ICON_LIST } from "@/utils/consts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { parse } from "plist";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";
import { JsonColoredText } from "./jsonText";
type KeyValue = { key: string; value: any };

export interface ImportResponse {
  payloads: KeyValue[];
  meta: { title: string; description: string | undefined; icon: string };
  settings: any;
}
interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: ImportResponse) => void;
}

const ImportDialog: React.FC<Props> = ({ visible, onDismiss, onSubmit }) => {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>(ICON_LIST[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValue[]>([]);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [plistJson, setPlistJson] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const items = plistJson?.PayloadContent || [];

  const { settings } = useParsedPlist(plistJson ?? {});

  const handleFileUpload = async () => {
    setErrorMessage(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      console.log("DocumentPicker result:", result);
      if (result.assets) {
        const selectedFile = result.assets[0].uri;
        let fileContent: string;

        if (selectedFile.startsWith("data:")) {
          const base64Data = selectedFile.split(",")[1];
          fileContent = atob(base64Data);
        } else {
          fileContent = await FileSystem.readAsStringAsync(selectedFile);
        }

        const parsed = parse(fileContent);
        setPlistJson(parsed);
      }
    } catch (error) {
      console.error("Failed to parse file:", error);
      setErrorMessage(
        "Failed to parse plist file. Please check the file format.",
      );
    }
  };
  const handleSelect = (selectedKey: string) => {
    const updated = [...keyValuePairs];
    updated[currentIndex] = { key: selectedKey, value: items[currentIndex] };
    setKeyValuePairs(updated);
    setSelectModalVisible(false);
  };

  const reset = () => {
    setStep(0);
    setTitle("");
    setDescription("");
    setSelectedIcon(ICON_LIST[0]);
    setCurrentIndex(0);
    setKeyValuePairs([]);
    setSelectModalVisible(false);
    setPlistJson(null);
    setErrorMessage(null);
    onDismiss();
  };

  const handleNextFromMetadata = () => {
    setStep(1);
  };

  const handleNextKey = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep(2);
    }
  };

  const handleBackKey = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setStep(0);
    }
  };

  const handleBackOverview = () => {
    setStep(1);
    setCurrentIndex(items.length - 1);
  };

  const handleFinalSubmit = () => {
    onSubmit({
      payloads: keyValuePairs,
      meta: { title, description, icon: selectedIcon },
      settings,
    });
    reset();
  };

  const selectedKeyForCurrent = keyValuePairs[currentIndex]?.key ?? null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={reset} style={{ maxHeight: "80%" }}>
        <Dialog.Title>
          {step === 0 && "Import Config"}
          {step === 1 &&
            `Assign Payload (${currentIndex + 1} / ${items.length})`}
          {step === 2 && "Create Overview"}
        </Dialog.Title>

        <Dialog.Content>
          {step === 0 && (
            <>
              <TextInput
                label="Title*"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={{ marginBottom: 16 }}
              />
              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ marginBottom: 16 }}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {ICON_LIST.map((iconName) => (
                    <IconButton
                      key={iconName}
                      icon={({ size }) => (
                        <MaterialIcons
                          name={iconName}
                          size={size}
                          color={
                            selectedIcon === iconName
                              ? theme.colors.onPrimary
                              : theme.colors.onBackground
                          }
                        />
                      )}
                      mode={selectedIcon === iconName ? "contained" : "oulined"}
                      onPress={() => setSelectedIcon(iconName)}
                      style={{
                        backgroundColor:
                          selectedIcon === iconName
                            ? theme.colors.primary
                            : "transparent",
                      }}
                    />
                  ))}
                </View>
              </ScrollView>
              <Button
                mode="outlined"
                onPress={handleFileUpload}
                style={{ marginBottom: 16 }}
              >
                Upload Plist File
              </Button>
              {errorMessage && (
                <Text style={{ color: "red", marginBottom: 16 }}>
                  {errorMessage}
                </Text>
              )}
              {plistJson && (
                <ScrollView
                  style={styles.jsonContainer}
                  contentContainerStyle={{ padding: 8, marginBottom: 16 }}
                >
                  <JsonColoredText data={plistJson} />
                </ScrollView>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <ScrollView
                style={styles.jsonContainer}
                contentContainerStyle={{ padding: 8 }}
              >
                <JsonColoredText data={items[currentIndex]} />
              </ScrollView>
              <Button
                mode="contained"
                onPress={() => setSelectModalVisible(true)}
                style={{ marginBottom: 12 }}
              >
                {selectedKeyForCurrent
                  ? `Selected Payload: ${selectedKeyForCurrent}`
                  : "Select Payload"}
              </Button>
            </>
          )}

          {step === 2 && (
            <ScrollView style={{ maxHeight: 300 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 12,
                  color: theme.colors.onBackground,
                }}
              >
                Metadata:
              </Text>
              <List.Item
                title={title || "No name provided"}
                description={description}
                left={() => (
                  <MaterialIcons
                    name={selectedIcon}
                    size={25}
                    style={{ alignSelf: "center", paddingHorizontal: 5 }}
                    color={theme.colors.primary}
                  />
                )}
              />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 20,
                  marginBottom: 12,
                  color: theme.colors.onBackground,
                }}
              >
                Payloads:
              </Text>
              {keyValuePairs.map((pair, i) => (
                <View key={i} style={styles.submittedPair}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: theme.colors.onBackground,
                    }}
                  >
                    Key:
                  </Text>
                  <Text style={{ color: theme.colors.onBackground }}>
                    {pair.key}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 4,
                      color: theme.colors.onBackground,
                    }}
                  >
                    Value:
                  </Text>
                  <ScrollView
                    style={styles.jsonContainer}
                    contentContainerStyle={{ padding: 8 }}
                  >
                    <JsonColoredText data={pair.value} />
                  </ScrollView>
                </View>
              ))}
            </ScrollView>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          {step === 0 && (
            <>
              <Button onPress={reset}>Cancel</Button>
              <Button
                mode="contained"
                disabled={!title || !plistJson}
                onPress={handleNextFromMetadata}
              >
                Next
              </Button>
            </>
          )}

          {step === 1 && (
            <>
              <Button onPress={handleBackKey}>Back</Button>
              <Button
                mode="contained"
                onPress={handleNextKey}
                disabled={!selectedKeyForCurrent}
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button onPress={handleBackOverview}>Back</Button>
              <Button mode="contained" onPress={handleFinalSubmit}>
                Create
              </Button>
            </>
          )}
        </Dialog.Actions>

        <PayloadDataTableModal
          visible={selectModalVisible}
          onSelect={handleSelect}
          onClose={() => setSelectModalVisible(false)}
        />
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  jsonContainer: {
    maxHeight: 150,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    marginBottom: 12,
  },
  submittedPair: {
    marginBottom: 10,
  },
});

export default ImportDialog;
