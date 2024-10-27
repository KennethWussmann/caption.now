import { atomWithStorage } from "jotai/utils";
import { Atom } from "jotai/vanilla";
import { z } from "zod";

export const atomWithZod = <T extends z.Schema, V>(
  storageKey: string,
  initialValue: V,
  schema: T
) => {
  const theAtom: Atom<z.infer<typeof schema>> = atomWithStorage(
    storageKey,
    initialValue,
    {
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
    }
  );
  return theAtom;
};
