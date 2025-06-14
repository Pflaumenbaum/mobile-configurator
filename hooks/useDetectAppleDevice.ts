import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useDetectAppleDevice(): boolean {
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
      setIsAppleDevice(isMac);
    } else {
      setIsAppleDevice(Platform.OS === "ios" || Platform.OS === "macos");
    }
  }, []);

  return isAppleDevice;
}
