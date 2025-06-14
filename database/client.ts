import { type SQLiteDatabase } from "expo-sqlite";
import { Config } from "./types";

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE configs (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT,
        settings TEXT,
        data TEXT
      );
    `);
    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function createConfig(
  db: SQLiteDatabase,
  config: Omit<Config, "id">,
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO configs (title, icon, description, data, settings) VALUES (?, ?, ?, ?, ?)`,
    config.title,
    config.icon,
    config.description || null,
    config.data || null,
    config.settings || null,
  );
  return result.lastInsertRowId;
}

export async function getAllConfigs(db: SQLiteDatabase): Promise<Config[]> {
  return await db.getAllAsync("SELECT * FROM configs");
}

export async function getConfigById(
  db: SQLiteDatabase,
  id: number,
): Promise<Config> {
  return (await db.getFirstAsync(
    "SELECT * FROM configs WHERE id = ?",
    id,
  )) as Config;
}

export async function deleteConfig(db: SQLiteDatabase, id: number) {
  return await db.runAsync("DELETE FROM configs WHERE id = ?", id);
}

export async function updateConfig(
  db: SQLiteDatabase,
  id: number,
  updates: {
    title?: string;
    icon?: string;
    description?: string;
    data?: string;
    settings?: string;
  },
) {
  const fields = [];
  const values: (string | number)[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.icon !== undefined) {
    fields.push("icon = ?");
    values.push(updates.icon);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.data !== undefined) {
    fields.push("data = ?");
    values.push(updates.data);
  }
  if (updates.settings !== undefined) {
    fields.push("settings = ?");
    values.push(updates.settings);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);
  const sql = `UPDATE configs SET ${fields.join(", ")} WHERE id = ?`;
  return await db.runAsync(sql, ...values);
}
