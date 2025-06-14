import React, { createContext, ReactNode, useContext, useState } from "react";
import { Modal, useWindowDimensions, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

interface LoadingContextProps {
  setLoading: (visible: boolean) => void;
  visible: boolean;
}

const LoadingContext = createContext<LoadingContextProps>({
  setLoading: () => {},
  visible: false,
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("Bitte warten...");
  const { width, height } = useWindowDimensions(); // Get screen width and height
  const theme = useTheme();
  const setLoading = (isVisible: boolean, customMessage?: string) => {
    setVisible(isVisible);
    if (isVisible && customMessage) {
      setMessage(customMessage);
    } else if (!isVisible) {
      setMessage("");
    }
  };

  return (
    <LoadingContext.Provider value={{ setLoading, visible }}>
      {children}

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            position: "absolute",
            flex: 1,
            zIndex: 9999,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height,
            width,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};
