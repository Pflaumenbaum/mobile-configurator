import { useMemo } from "react";

interface KeyValue<T = string> {
  key: string;
  value: T;
}

export const useValuesOnly = <T = string>(items: KeyValue<T>[]): T[] => {
  return useMemo(() => {
    return items?.map((item) => item.value) ?? [];
  }, [items]);
};
