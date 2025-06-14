import * as Crypto from "expo-crypto";

export const getDefaultSettings = () => {
  return {
    PayloadDisplayName: "Untitled Profile",
    PayloadIdentifier:
      "com.example.profile" + Math.floor(Math.random() * 100 + 1),
    PayloadType: "Configuration",
    PayloadUUID: Crypto.randomUUID(),
    PayloadVersion: 1,
  };
};
