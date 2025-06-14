import { Platform } from "react-native";

import { useDialog } from "@/contexts/dialog";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import base64 from "react-native-base64";

export const installMobileConfig = async (config: string) => {
  if (Platform.OS === "ios") {
    const base64Config = base64.encode(config);
    const downloadURL = `http://localhost:8081/config/download/${base64Config}`;
    await WebBrowser.openBrowserAsync(downloadURL, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    });
  } else {
    const blob = new Blob([config], {
      type: "application/x-apple-aspen-config",
    });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }
};

const canUseWebShare = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.share === "function" &&
  typeof window !== "undefined" &&
  typeof window.Blob === "function";

export const shareMobileConfig = async (
  config: string,
  dialog: ReturnType<typeof useDialog>,
  name?: string,
) => {
  const filename = name ? name + ".mobileconfig" : "profile.mobileconfig";

  if (
    Platform.OS === "ios" ||
    Platform.OS === "macos" ||
    Platform.OS === "android"
  ) {
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, config, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/x-apple-aspen-config",
      });
    } else {
      dialog.alert(
        "Sharing not available",
        "Your device does not support sharing.",
      );
    }
  } else if (Platform.OS === "web") {
    const blob = new Blob([config], {
      type: "application/x-apple-aspen-config",
    });

    if (canUseWebShare()) {
      const file = new File([blob], filename, {
        type: "application/x-apple-aspen-config",
      });

      try {
        await navigator.share({
          files: [file],
          title: "Install Apple Configuration Profile",
          text: "Install this configuration profile on your device.",
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      dialog.alert(
        "Unsupported",
        "Sharing is not supported in this browser. Please download the file instead.",
      );
    }
  }
};
