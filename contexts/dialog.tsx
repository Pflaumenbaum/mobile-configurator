import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { Button, Dialog, Text, TextInput } from "react-native-paper";
import { FullWindowOverlay } from "react-native-screens";

type DialogType = "prompt" | "confirm" | null;

interface DialogContextProps {
  alert: (title: string, message: string) => void;
  prompt: (title: string, description: string) => Promise<string>;
  confirm: (title: string, description: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialog = (): DialogContextProps => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within DialogProvider");
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<DialogType>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [resolveReject, setResolveReject] = useState<{
    resolve: (val: any) => void;
    reject: (reason?: any) => void;
  } | null>(null);

  const [alertQueue, setAlertQueue] = useState<
    { title: string; message: string }[]
  >([]);
  const [currentAlert, setCurrentAlert] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [nextDialog, setNextDialog] = useState<{
    type: DialogType;
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    if (nextDialog) {
      setType(nextDialog.type);
      setTitle(nextDialog.title);
      setDescription(nextDialog.description || "");
      setVisible(true);
      setNextDialog(null);
    }
  }, [nextDialog]);

  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      const [next, ...rest] = alertQueue;
      setCurrentAlert(next);
      setAlertQueue(rest);
    }
  }, [alertQueue, currentAlert]);

  const alert = (title: string, message: string): void => {
    setAlertQueue((q) => [...q, { title, message }]);
  };

  const prompt = (title: string, description: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setResolveReject({ resolve, reject });
      setNextDialog({ type: "prompt", title, description });
    });
  };

  const confirm = (title: string, description: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setResolveReject({ resolve, reject });
      setNextDialog({ type: "confirm", title, description });
    });
  };

  const hideDialog = () => {
    setVisible(false);
    setPromptValue("");
    setResolveReject(null);
    setType(null);
    setTitle("");
    setDescription("");
  };

  const handlePromptSubmit = () => {
    resolveReject?.resolve(promptValue);
    hideDialog();
  };

  const handlePromptCancel = () => {
    resolveReject?.reject(new Error("prompt cancelled"));
    hideDialog();
  };

  const handleConfirm = (result: boolean) => {
    resolveReject?.resolve(result);
    hideDialog();
  };

  const handleConfirmCancel = () => {
    hideDialog();
  };

  const handleAlertClose = () => {
    setCurrentAlert(null);
  };

  const Overlay = ({ children }: { children: React.ReactNode }) => {
    if (Platform.OS === "web") {
      return children;
    } else {
      return <FullWindowOverlay>{children}</FullWindowOverlay>;
    }
  };
  return (
    <DialogContext.Provider value={{ alert, prompt, confirm }}>
      {children}

      <Overlay>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{title}</Dialog.Title>

          {description ? (
            <Dialog.Content>
              <Text>{description}</Text>
            </Dialog.Content>
          ) : null}

          {type === "prompt" && (
            <>
              <Dialog.Content>
                <TextInput
                  label="Enter value"
                  value={promptValue}
                  onChangeText={setPromptValue}
                  autoFocus
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handlePromptCancel}>Cancel</Button>
                <Button onPress={handlePromptSubmit}>Submit</Button>
              </Dialog.Actions>
            </>
          )}

          {type === "confirm" && (
            <Dialog.Actions>
              <Button onPress={handleConfirmCancel}>Cancel</Button>
              <Button onPress={() => handleConfirm(true)}>Yes</Button>
            </Dialog.Actions>
          )}
        </Dialog>

        {currentAlert && (
          <Dialog visible onDismiss={handleAlertClose}>
            <Dialog.Title>{currentAlert.title}</Dialog.Title>
            <Dialog.Content>
              <Text>{currentAlert.message}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleAlertClose}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Overlay>
    </DialogContext.Provider>
  );
};
