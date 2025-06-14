import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Dialog, List, Portal, TextInput } from "react-native-paper";

type FileInputProps = {
  label?: string;
  defaultValue?: string;
  onChange?: (base64: string) => void;
};

const truncateBase64 = (base64: string, length = 60): string => {
  if (!base64) return "";
  return base64.length > length
    ? `${base64.slice(0, length / 2)}...${base64.slice(-length / 2)}`
    : base64;
};

const FileInput: React.FC<FileInputProps> = ({
  label = "Select File",
  defaultValue = "",
  onChange,
}) => {
  const [visible, setVisible] = useState(false);
  const [base64Data, setBase64Data] = useState<string>("");

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleBase64Update = (base64: string) => {
    setBase64Data(base64);
    onChange?.(base64);
  };

  const readFileAsBase64Web = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePickDocument = async () => {
    hideDialog();
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        const base64 = await readFileAsBase64Web(blob as File);
        handleBase64Update("base64://" + base64);
      } else {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        handleBase64Update("base64://" + base64);
      }
    }
  };

  const handlePickImage = async () => {
    hideDialog();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });
    if (
      !result.canceled &&
      result.assets.length > 0 &&
      result.assets[0].base64
    ) {
      handleBase64Update("base64://" + result.assets[0].base64);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDialog}>
        <TextInput
          label={label}
          defaultValue={defaultValue}
          value={base64Data ? truncateBase64(base64Data): defaultValue}
          editable={false}
          pointerEvents="none"
          right={<TextInput.Icon onPress={showDialog} icon="file" />}
        />
      </TouchableOpacity>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Select File</Dialog.Title>
          <Dialog.Content>
            <List.Section>
              <List.Item
                title="Pick Photo from Gallery"
                left={(props) => <List.Icon {...props} icon="image" />}
                onPress={handlePickImage}
              />
              <List.Item
                title="Pick File from File System"
                left={(props) => <List.Icon {...props} icon="file" />}
                onPress={handlePickDocument}
              />
            </List.Section>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default FileInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});
