import { ICON_LIST } from "@/utils/consts";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";

interface ConfigDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    icon: string;
  }) => void;
  initialData?: {
    title?: string;
    description?: string;
    icon?: string;
  };
mode?: "edit" | "create";
}

const ConfigDialog: React.FC<ConfigDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData = {},
  mode = "create"
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [icon, setSelectedIcon] = useState(initialData.icon || ICON_LIST[0]);

  useEffect(() => {
    if (visible) {
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");
      setSelectedIcon(initialData.icon ?? ICON_LIST[0]);
    }
  }, [visible]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>{mode === "create" ? "Create" : "Update"} Config</Dialog.Title>
        <Dialog.Content>
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
            contentContainerStyle={{ paddingTop: 20 }}
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
                        icon === iconName
                          ? theme.colors.onPrimary
                          : theme.colors.onBackground
                      }
                    />
                  )}
                  mode={icon === iconName ? "contained" : "outlined"}
                  onPress={() => setSelectedIcon(iconName)}
                  style={{
                    backgroundColor:
                      icon === iconName ? theme.colors.primary : "transparent",
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancel</Button>
          <Button 
            disabled={!title || !icon}
            mode="contained"
            onPress={() => onSubmit({ title, description, icon })}
            style={{ paddingHorizontal: 20 }}
          >
          {mode === "create" ? "Create" : "Update"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfigDialog;
