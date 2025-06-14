import { useDialog } from "@/contexts/dialog";
import { getConfigById, updateConfig } from "@/database/client";
import { Href } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";
import { goBack } from "./router";

export const addPayload = async (
  db: SQLiteDatabase,
  id: string,
  data: any,
  setLoading: any,
  key: string,
  dialog: ReturnType<typeof useDialog>,
) => {
  const backPath = ("/config/" + id) as Href;
  try {
    setLoading(true);
    const response = await getConfigById(db, Number(id));
    const parsedData = JSON.parse(response.data || "[]");
    const newData = [...parsedData, { key: key, value: data }];
    const dataString = JSON.stringify(newData);
    await updateConfig(db, id as any as number, { data: dataString });
  } catch (err) {
    setLoading(false);
    dialog.alert(
      "Error adding Payload",
      "Failed to add the payload. Please try again.",
    );
    goBack(backPath);
  } finally {
    setLoading(false);
    goBack(backPath);
  }
};

export const updatePayload = async (
  db: SQLiteDatabase,
  id: string,
  index: number,
  newData: any,
  setLoading: any,
  dialog: ReturnType<typeof useDialog>,
) => {
  const backPath = ("/config/" + id) as Href;
  try {
    setLoading(true);
    const response = await getConfigById(db, Number(id));
    const parsedData = JSON.parse(response.data || "[]");
    if (index < 0 || index >= parsedData.length) {
      throw new Error("Invalid index");
    }
    parsedData[index].value = newData;
    const dataString = JSON.stringify(parsedData);
    await updateConfig(db, Number(id), { data: dataString });
  } catch (err) {
    setLoading(false);
    dialog.alert(
      "Error updating Payload",
      "Failed to update the payload. Please try again.",
    );
    goBack(backPath);
  } finally {
    setLoading(false);
    goBack(backPath);
  }
};

export const deletePayload = async (
  db: SQLiteDatabase,
  id: string,
  index: number,
  setLoading: any,
  dialog: ReturnType<typeof useDialog>,
) => {
  const backPath = ("/config/" + id) as Href;
  const confirmed = await dialog.confirm(
    "Confirm Delete",
    "Are you sure you want to delete this payload?",
  );

  if (!confirmed) {
    return;
  }

  try {
    setLoading(true);
    const response = await getConfigById(db, Number(id));
    const parsedData = JSON.parse(response.data || "[]");

    if (index < 0 || index >= parsedData.length) {
      throw new Error("Invalid index");
    }

    parsedData.splice(index, 1);
    const dataString = JSON.stringify(parsedData);
    await updateConfig(db, Number(id), { data: dataString });
  } catch (err) {
    setLoading(false);
    dialog.alert(
      "Error deleting Payload",
      "Failed to delete the payload. Please try again.",
    );
    goBack(backPath);
  } finally {
    setLoading(false);
    goBack(backPath);
  }
};
