import { useMemo } from "react";

export const useParsedPlist = (json: any) => {
  const settings = useMemo(() => {
    const { PayloadContent, ...rest } = json;
    return rest;
  }, [json]);

  const payloads = useMemo(() => json.PayloadContent ?? [], [json]);

  return { settings, payloads };
};
