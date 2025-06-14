import ContentUnavailable from "@/components/contentUnavailable";
import PayloadForm from "@/components/form";
import { useDialog } from "@/contexts/dialog";
import { useLoading } from "@/contexts/loading";
import { getConfigById } from "@/database/client";
import { Config } from "@/database/types";
import Definition from "@/definitions";
import { deletePayload, updatePayload } from "@/utils/payload";
import { goBack } from "@/utils/router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Href, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

const Page = () => {
  const { id, index, key } = useLocalSearchParams<{
    id: string;
    key: string;
    index: string;
  }>();
  const db = useSQLiteContext();
  const dialog = useDialog();
  const headerHeight = useHeaderHeight();
  const theme = useTheme();
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState<boolean>(false);
  const { setLoading } = useLoading();
  const payload = config?.data[Number(index)] && config?.data[Number(index)];
  useEffect(() => {
    const loadConfig = async () => {
      if (!id || !index || !key) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getConfigById(db, id as any as number);
        const parsedData = JSON.parse(response.data || "[]");
        const parsedResponse = { ...response, data: parsedData };
        setConfig(parsedResponse ?? null);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [id]);

  const handleUpdate = (data: any) => {
    updatePayload(db, id, index as any as number, data, setLoading, dialog);
  };
  const handleDelete = () => {
    deletePayload(db, id, index as any as number, setLoading, dialog);
  };

  const renderHeader = () => {
    return (
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => goBack(("/config/" + id) as Href)} />
        <Appbar.Content title={payload.PayloadDisplayName || "View Payload"} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>
    );
  };

  if (error || !config) {
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
      <Stack.Screen options={{ header: renderHeader }} />
      <View
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
          paddingTop: headerHeight,
        }}
      >
        {key in Definition ? (
          <PayloadForm
            onSubmit={handleUpdate}
            initialformState={payload?.value}
            schema={Definition[key]}
          />
        ) : (
          <ContentUnavailable
            icon="error"
            title="Payload not found"
            description="Please try again"
          />
        )}
      </View>
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
});

export default Page;
