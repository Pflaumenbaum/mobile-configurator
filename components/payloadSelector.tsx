import Definition from "@/definitions";
import { ProfileManifest } from "@/definitions/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { Modal, Platform, ScrollView, View } from "react-native";
import { DataTable, IconButton, Searchbar, useTheme } from "react-native-paper";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: string, payload: ProfileManifest) => void;
}

const PayloadDataTableModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const theme = useTheme();

  const entries = Object.entries(Definition) as [string, ProfileManifest][];
  const filtered = entries.filter(([_, value]) =>
    value.pfm_title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filtered.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, searchQuery]);

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
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {Platform.OS !== "ios" && (
            <IconButton
              onPress={onClose}
              icon={({ size, color }) => (
                <MaterialIcons name="arrow-back" size={size} color={color} />
              )}
            />
          )}
          <Searchbar
            placeholder="Search payloads"
            value={searchQuery}
            clearIcon={({ size, color }) => (
              <Ionicons name="close-circle-outline" size={size} color={color} />
            )}
            onChangeText={setSearchQuery}
            style={{ marginBottom: 16, flex: 1 }}
          />
          {Platform.OS === "ios" && (
            <IconButton onPress={onClose} icon="close" />
          )}
        </View>
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Title</DataTable.Title>
              <DataTable.Title>Domain</DataTable.Title>
              <DataTable.Title numeric>Version</DataTable.Title>
            </DataTable.Header>

            {filtered.slice(from, to).map(([key, payload], index) => (
              <DataTable.Row
                disabled={payload.pfm_domain === "Configuration"}
                key={key}
                onPress={() => {
                  onSelect(key, payload);
                  onClose();
                }}
              >
                <DataTable.Cell>{payload.pfm_title}</DataTable.Cell>
                <DataTable.Cell>{payload.pfm_domain}</DataTable.Cell>
                <DataTable.Cell numeric>{payload.pfm_version}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(filtered.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${filtered.length}`}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              showFastPaginationControls
            />
          </DataTable>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PayloadDataTableModal;
