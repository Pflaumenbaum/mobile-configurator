import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { FlatList, Platform, View } from "react-native";
import { Appbar, Divider, FAB, List, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ConfigDialog from "@/components/configDialog";
import ContentUnavailable from "@/components/contentUnavailable";
import ImportDialog, { ImportResponse } from "@/components/importDialog";
import { useLoading } from "@/contexts/loading";
import { createConfig, getAllConfigs } from "@/database/client";
import { Config } from "@/database/types";
import { ICON_LIST } from "@/utils/consts";
import { getDefaultSettings } from "@/utils/settings";
import { useHeaderHeight } from "@react-navigation/elements";
import { addDatabaseChangeListener, useSQLiteContext } from "expo-sqlite";

const Page = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { setLoading } = useLoading();

  const [configs, setConfigs] = useState<Config[]>([]);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const headerHeight = useHeaderHeight();
  const loadConfigs = useCallback(async () => {
    const data = await getAllConfigs(db);
    setConfigs(data);
  }, []);

  if (Platform.OS === "web") {
    useFocusEffect(
      useCallback(() => {
        loadConfigs();
      }, [])
    );
  } else {
    useEffect(() => {
      addDatabaseChangeListener(() => {
        loadConfigs();
      });
      loadConfigs();
    }, []);
  }
  const handleSubmitImport = async (importedData: ImportResponse) => {
    console.log(importedData);
    try {
      setLoading(true);

      const { title, description, icon } = importedData.meta;
      const data = JSON.stringify(importedData.payloads);
      const settings = JSON.stringify(importedData.settings);
      console.log(data);
      console.log(settings);
      await createConfig(db, { title, description, icon, data, settings });
      setImportDialogVisible(false);
      await loadConfigs();
    } catch (err) {
      alert("Error creating Profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCreate = async ({
    title,
    description,
    icon = ICON_LIST[0],
  }: {
    title: string;
    description: string;
    icon?: string;
  }) => {
    try {
      const defaultSettings = getDefaultSettings();
      const settings = JSON.stringify(defaultSettings);
      const data = "[]";
      setLoading(true);
      await createConfig(db, { title, description, icon, data, settings });
      setCreateDialogVisible(false);

      await loadConfigs();
    } catch (err) {
      alert("Error creating Profile");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Config }) => (
    <>
      <List.Item
        title={item.title}
        description={item.description || "No description"}
        left={() => (
          <MaterialIcons
            name={item.icon as any}
            size={25}
            style={{ alignSelf: "center", paddingHorizontal: 5 }}
            color={theme.colors.primary}
          />
        )}
        onPress={() => router.push(`/config/${item.id}`)}
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

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header elevated mode="medium">
              <Appbar.Content title="Mobile Configurator" />
              <Appbar.Action
                icon="help-circle-outline"
                size={30}
                onPress={() => router.push("/about")}
              />
            </Appbar.Header>
          ),
        }}
      />

      <ConfigDialog
        visible={createDialogVisible}
        onClose={() => setCreateDialogVisible(false)}
        onSubmit={(data) => {
          handleSubmitCreate(data);
          setCreateDialogVisible(false);
        }}
      />

      <ImportDialog
        visible={importDialogVisible}
        onSubmit={(data) => handleSubmitImport(data)}
        onDismiss={() => setImportDialogVisible(false)}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: headerHeight,
        }}
      >
        <FlatList
          data={configs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
        />

        <FAB.Group
          open={fabExpanded}
          onStateChange={({ open }) => setFabExpanded(open)}
          visible={true}
          icon="plus"
          label="Add"
          actions={[
            {
              icon: "plus",
              label: "create",
              onPress: () => setCreateDialogVisible(true),
            },
            {
              icon: "import",
              label: "import",
              onPress: () => setImportDialogVisible(true),
            },
          ]}
          style={{
            position: "absolute",
            right: 5,
            bottom: insets.bottom,
          }}
        />
      </View>
    </>
  );
};

export default Page;
