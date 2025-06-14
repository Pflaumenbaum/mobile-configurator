import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Divider,
  FAB,
  List,
  SegmentedButtons,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import ConfigDialog from "@/components/configDialog";
import ContentUnavailable from "@/components/contentUnavailable";
import DownloadModal from "@/components/download";
import PayloadForm from "@/components/form";
import PayloadDataTableModal from "@/components/payloadSelector";
import { useDialog } from "@/contexts/dialog";
import { useLoading } from "@/contexts/loading";
import { deleteConfig, getConfigById, updateConfig } from "@/database/client";
import { Config } from "@/database/types";
import Definition from "@/definitions";
import { ProfileManifest } from "@/definitions/types";
import { useConfig } from "@/hooks/useConfig";
import { useValuesOnly } from "@/hooks/useValuesOnly";
import { ICON_LIST } from "@/utils/consts";
import { createPlist } from "@/utils/plist";
import { goBack } from "@/utils/router";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Crypto from "expo-crypto";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();
  const [config, setConfig] = useState<Config | null>(null);
  const dialog = useDialog();
  const [error, setError] = useState(false);
  const { setLoading } = useLoading();
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const db = useSQLiteContext();
  const payloadValues = useValuesOnly(config?.data);
  const preparedConfig = useConfig(config?.settings, payloadValues);
  const [activeView, setActiveView] = useState("home");
  const handleSelect = (key: string, payload: ProfileManifest) => {
    router.push({ pathname: "/config/add", params: { id: id, key: key } });
  };
  const [plist, setPlist] = useState<string>();

  const handleDownload = () => {
    setLoading(true);
    const data = createPlist(preparedConfig || []);
    setPlist(data);
    setLoading(false);
    setDownloadModalVisible(true);
  };

  const loadConfig = async () => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getConfigById(db, id as any as number);
      const parsedData = JSON.parse(response.data || "[]");
      const parsedSettings = JSON.parse(response.settings);
      const parsedResponse = {
        ...response,
        data: parsedData,
        settings: parsedSettings,
      };
      setConfig(parsedResponse ?? null);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = (data: any) => {
    const settingsJson = JSON.stringify(data);
    console.log(data);
    updateConfig(db, id as any, { settings: settingsJson });
    loadConfig();
  };
  if (Platform.OS === "web") {
    useFocusEffect(
      useCallback(() => {
        loadConfig();
      }, [id])
    );
  } else {
    useEffect(() => {
      addDatabaseChangeListener(() => {
        loadConfig();
      });
      loadConfig();
    }, [id]);
  }
  const handleDeleteConfig = async () => {
    try {
      const isConfirmed = await dialog.confirm(
        "Delete Configuration",
        "Are you sure you want to delete this configuration? This action cannot be undone."
      );

      if (isConfirmed) {
        deleteConfig(db, id as any as number);
        goBack();
      } else {
        console.log("Deletion cancelled");
      }
    } catch (error) {
      console.log("Confirm dialog cancelled or closed", error);
    }
  };
  const handleUpdateConfig = async ({
    title,
    description,
    icon = ICON_LIST[0],
  }: {
    title: string;
    description: string;
    icon?: string;
  }) => {
    try {
      await setLoading(true);
      setUpdateDialogVisible(false);
      await updateConfig(db, id as any as number, { title, description, icon });
      loadConfig();
    } catch (error) {
      setUpdateDialogVisible(false);
      dialog.alert(
        "Error",
        "An error occurred while updating the configuration. Please try again later."
      );
      console.error("Error updating configuration:", error);
      await setLoading(false);
    } finally {
      await setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <>
      <List.Item
        onPress={() =>
          router.push({
            pathname: "/config/updatePayload",
            params: { id: id, index: index, key: item?.key },
          })
        }
        title={item?.value?.PayloadDisplayName || "No name provided"}
        description={item?.value?.PayloadDescription}
        left={() => (
          <MaterialIcons
            name="settings"
            size={25}
            style={{ alignSelf: "center", paddingHorizontal: 5 }}
            color={theme.colors.primary}
          />
        )}
      />
      <Divider />
    </>
  );

  const renderEmpty = () => (
    <ContentUnavailable
      icon="search"
      title="No configurations found."
      description="Click on the + button to add one "
    />
  );

  const renderHeader = () => {
    return (
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={() => goBack()} />
        <MaterialIcons
          style={{
            backgroundColor: theme.colors.secondaryContainer,
            borderRadius: 99,
            padding: 10,
            marginRight: 10,
          }}
          size={25}
          color={theme.colors.onBackground}
          name={config?.icon as any}
        />
        <Appbar.Content title={config?.title || "Details"} />
        <Appbar.Action
          icon="pencil"
          size={25}
          style={{ marginRight: -5 }}
          onPress={() => setUpdateDialogVisible(true)}
        />
        <Appbar.Action
          icon="plus"
          size={30}
          onPress={() => setSelectModalVisible(true)}
        />
      </Appbar.Header>
    );
  };

  if (error || !config?.data) {
    return (
      <>
        <View
          style={[
            styles.centered,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ContentUnavailable
            icon="error"
            title="Something went wrong"
            description="Please try again later"
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, header: () => renderHeader() }}
      />

      <ConfigDialog
        visible={updateDialogVisible}
        initialData={{ ...config }}
        onClose={() => setUpdateDialogVisible(false)}
        onSubmit={handleUpdateConfig}
        mode="edit"
      />

      <PayloadDataTableModal
        visible={selectModalVisible}
        onSelect={handleSelect}
        onClose={() => setSelectModalVisible(false)}
      />
      <DownloadModal
        config={config}
        plist={plist}
        visible={downloadModalVisible}
        onClose={() => setDownloadModalVisible(false)}
      />

      <View
        style={{
          height: "100%",
          backgroundColor: theme.colors.background,
          paddingTop: headerHeight,
        }}
      >
        <SegmentedButtons
          value={activeView}
          onValueChange={setActiveView}
          buttons={[
            { value: "home", label: "Payloads" },
            { value: "config", label: "Settings" },
          ]}
          style={{ margin: 12 }}
        />

        {activeView === "home" ? (
          <FlatList
            data={config.data}
            keyExtractor={(item: any) =>
              item?.PayloadUUID?.toString() || Crypto.randomUUID()
            }
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
          />
        ) : (
          <ScrollView style={{ padding: 16 }}>
            <PayloadForm
              schema={Definition.configuration}
              onSubmit={handleUpdateSettings}
              initialformState={config.settings}
            />
            <Button
              onPress={handleDeleteConfig}
              textColor={theme.colors.error}
              style={{
                marginTop: -10,
                marginHorizontal: 15,
                paddingVertical: 10,
              }}
              mode="text"
            >
              Delete Paylod
            </Button>
          </ScrollView>
        )}
      </View>

      <FAB
        onPress={() => handleDownload()}
        icon={({ size, color }) => (
          <MaterialIcons name="share" size={size} color={color} />
        )}
        style={[
          styles.fab,
          {
            bottom: bottom + 30,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    height: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
  },
});

export default Page;
