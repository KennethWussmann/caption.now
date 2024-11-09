import { atomWithStorage } from "jotai/utils";
import { z } from "zod";

export const atomWithZod = <V, T extends z.Schema<V>>(
  storageKey: string,
  initialValue: z.infer<T>,
  schema: T
) => {
  const atom = atomWithStorage<z.infer<T>>(storageKey, initialValue, {
    getItem: (key, initial) => {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) {
        return initial;
      }

      return schema.parse(JSON.parse(storedValue));
    },
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
  });
  return atom;
};
