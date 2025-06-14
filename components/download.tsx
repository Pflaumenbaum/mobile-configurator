import { useDialog } from "@/contexts/dialog";
import { useLoading } from "@/contexts/loading";
import { Config } from "@/database/types";
import { useDetectAppleDevice } from "@/hooks/useDetectAppleDevice";
import { installMobileConfig, shareMobileConfig } from "@/utils/install";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CodeEditor from "./codeEditor";
import ContentUnavailable from "./contentUnavailable";

interface Props {
  plist?: string;
  config?: Config;
  visible: boolean;
  onClose: () => void;
}

function formatXml(xml: any, tab: any) {
  var formatted = "",
    indent = "";
  tab = tab || "\t";
  xml?.split(/>\s*</).forEach(function (node: any) {
    if (node.match(/^\/\w/)) indent = indent?.substring(tab.length);
    formatted += indent + "<" + node + ">\r\n";
    if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
  });
  return formatted?.substring(1, formatted.length - 3);
}

const BOTTOM_APPBAR_HEIGHT = 80;

const DownloadModal: React.FC<Props> = ({
  visible,
  onClose,
  plist,
  config,
}) => {
  const { height, width } = useWindowDimensions();
  const theme = useTheme();
  const formattedPlist = formatXml(plist, "\t");
  const { bottom } = useSafeAreaInsets();
  const { setLoading } = useLoading();
  const [editorPlist, setEditorPlist] = useState<string>("");
  const isAppleDevice = useDetectAppleDevice();
  const dialog = useDialog();
  const handleInstall = async () => {
    setLoading(true);
    try {
      console.log("Sharing profile:", editorPlist);
      installMobileConfig(editorPlist);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to install the profile");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      shareMobileConfig(editorPlist, dialog, config?.title);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to share the profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setLoading(true);
    try {
      await Clipboard.setStringAsync(editorPlist);
    } catch (error) {
      setLoading(false);
      console.error("Failed to copy to clipboard:", error);
      dialog.alert("Error", "Failed to copy the profile to clipboard");
    } finally {
      setLoading(false);
      dialog.alert("Success", "Profile copied to clipboard");
    }
  };

  return (
    <Modal
      presentationStyle={Platform.OS === "android" ? "fullScreen" : "pageSheet"}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      style={{ margin: 0 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
          paddingBottom: 20,
        }}
      >
        {Platform.OS == "ios" ? (
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
          >
            <Text variant="headlineSmall" style={{ flex: 1 }}>
              Downlooad Config
            </Text>
            <IconButton
              style={{ marginRight: -5 }}
              onPress={onClose}
              icon="close"
            />
          </View>
        ) : (
          <Appbar.Header>
            <Appbar.BackAction onPress={onClose} />
            <Appbar.Content title="Download File" />
          </Appbar.Header>
        )}

        {config && plist ? (
          <ScrollView style={{ height: height }}>
            <Card style={{ paddingHorizontal: 10, marginVertical: 20 }}>
              <List.Item
                title={config.title}
                description={config.description || "No description"}
                left={({ color }) => (
                  <MaterialIcons
                    name={config.icon as any}
                    size={25}
                    style={{ alignSelf: "center", paddingHorizontal: 5 }}
                    color={color}
                  />
                )}
              />
            </Card>
            <Divider style={{ marginBottom: 20 }} />
            <CodeEditor
              height={height / 1.33}
              language="xml"
              autoComplete="plist"
              initialValue={formattedPlist}
              onChange={setEditorPlist}
            />
          </ScrollView>
        ) : (
          <ContentUnavailable title="no Data " icon="e" description="a" />
        )}
      </View>

      <Appbar
        style={{
          height: BOTTOM_APPBAR_HEIGHT + bottom,
          backgroundColor: theme.colors.elevation.level2,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          gap: 10,
          paddingHorizontal: 16,
        }}
        safeAreaInsets={{ bottom }}
      >
        <IconButton
          mode="outlined"
          onPress={handleCopyToClipboard}
          icon="clipboard"
        />
        <IconButton onPress={handleShare} mode="outlined" icon="share" />
        <Button onPress={handleInstall} style={{ flex: 1 }} mode="contained">
          {isAppleDevice ? "Install to Device" : "Downlaod"}
        </Button>
      </Appbar>
    </Modal>
  );
};

export default DownloadModal;
