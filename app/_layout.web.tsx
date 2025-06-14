import { DialogProvider } from "@/contexts/dialog";
import { LoadingProvider } from "@/contexts/loading";
import { migrateDbIfNeeded } from "@/database/client";

import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { PaperProvider } from "react-native-paper";

export const DATABASE_NAME = "configs";

export default function RootLayout() {
  return (
    <PaperProvider>
      <DialogProvider>
        <Suspense
          fallback={
            <ActivityIndicator
              size="large"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          }
        >
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            useSuspense
            onInit={migrateDbIfNeeded}
          >
            <React.Fragment>
              {Platform.OS === "web" ? (
                <style type="text/css">{`
        @font-face {
          font-family: 'MaterialDesignIcons';
          src: url(${require("@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf")}) format('truetype');
        }
      `}</style>
              ) : null}
              <LoadingProvider>
                <Stack
                  screenOptions={{
                    headerTransparent: Platform.OS !== "ios" ? true : false,
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: true }} />
                  <Stack.Screen
                    name="create"
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen
                    name="config/add"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="/updatePayload"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="config/[id]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="about"
                    options={{ presentation: "modal", headerShown: false }}
                  />
                </Stack>
              </LoadingProvider>
            </React.Fragment>
          </SQLiteProvider>
        </Suspense>
      </DialogProvider>
    </PaperProvider>
  );
}
