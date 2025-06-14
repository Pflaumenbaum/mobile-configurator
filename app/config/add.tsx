import ContentUnavailable from "@/components/contentUnavailable";
import PayloadForm from "@/components/form";
import { useDialog } from "@/contexts/dialog";
import { useLoading } from "@/contexts/loading";
import Definition from "@/definitions";
import { addPayload } from "@/utils/payload";
import { goBack } from "@/utils/router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Href, Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

const Page = () => {
  const { key, id } = useLocalSearchParams<{ key: string; id: string }>();
  const { setLoading } = useLoading();
  const dialog = useDialog();
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  const db = useSQLiteContext();

  const handleAdd = (data: any) => {
    addPayload(db, id, data, setLoading, key, dialog);
  };

  const renderHeader = () => {
    return (
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => goBack(("/config/" + id) as Href)} />
        <Appbar.Content title={"Add Payload"} />
      </Appbar.Header>
    );
  };
  return (
    <>
      <Stack.Screen options={{ header: renderHeader, headerShown: true }} />
      <View
        style={{
          height: "100%",
          backgroundColor: theme.colors.background,
          paddingTop: headerHeight,
        }}
      >
        {key in Definition ? (
          <PayloadForm
            onSubmit={(data) => handleAdd(data)}
            key={key}
            schema={Definition[key]}
          />
        ) : (
          <ContentUnavailable
            title="Not Found"
            icon="search"
            description="No payload found for the provided key."
          />
        )}
      </View>
    </>
  );
};

export default Page;
