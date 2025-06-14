import { ProfileManifest } from "@/definitions/types";
import { useMemo } from "react";

export const useConfig = (
  config: ProfileManifest,
  data: any[],
): ProfileManifest => {
  const updatedConfig = useMemo(() => {
    return {
      ...config,
      PayloadContent: data,
    };
  }, [config, data]);

  return updatedConfig;
};
