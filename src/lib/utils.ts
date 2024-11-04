import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateFilename = (
  filename: string,
  maxLength: number = 20
): string => {
  if (filename.length <= maxLength) return filename;

  const extensionIndex = filename.lastIndexOf(".");
  if (extensionIndex === -1) return filename;

  const extension = filename.substring(extensionIndex);
  const name = filename.substring(0, extensionIndex);

  const availableLength = maxLength - extension.length - 3; // 3 for "..."

  if (availableLength <= 0) return filename;
  const halfLength = Math.floor(availableLength / 2);

  const startPart = name.substring(0, halfLength);
  const endPart = name.substring(name.length - halfLength);

  return `${startPart}...${endPart}${extension}`;
};

export const tryJSONParse = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

export const deleteAllIndexedDBs = async () => {
  const databases = await indexedDB.databases();

  const deletePromises = databases
    .filter((db) => db.name?.includes("caption-now"))
    .map(
      (db) =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.deleteDatabase(db.name!);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
    );

  try {
    await Promise.all(deletePromises);
    console.log("All IndexedDB databases deleted successfully.");
  } catch (error) {
    console.error("Error deleting databases:", error);
  }
};

export const getFilenameWithoutExtension = (filename: string) => {
  const index = filename.lastIndexOf(".");
  if (index === -1) return filename;
  return filename.substring(0, index);
};

export const getPlatform = () => {
  const userAgent = window.navigator.userAgent;
  let os: "macOS" | "iOS" | "Windows" | "Android" | "Linux" | null = null;

  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (/Mac|Mac OS|MacIntel/gi.test(userAgent) &&
      (navigator.maxTouchPoints > 1 || "ontouchend" in document));

  if (/Macintosh|macOS|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(userAgent)) {
    os = "macOS";
  } else if (isIOS) {
    os = "iOS";
  } else if (/'Win32|Win64|Windows|Windows NT|WinCE/gi.test(userAgent)) {
    os = "Windows";
  } else if (/Android/gi.test(userAgent)) {
    os = "Android";
  } else if (/Linux/gi.test(userAgent)) {
    os = "Linux";
  }

  return os;
};
export const isMacOS = () => getPlatform() === "macOS";

export const replaceAll = (
  str: string,
  target: string,
  replacement: string
): string => {
  return str.split(target).join(replacement);
};

export const replaceShortcutSymbols = (
  shortcut: string | string[] | Set<string>
): string => {
  if (shortcut instanceof Set) {
    shortcut = Array.from(shortcut).join("");
  }
  if (Array.isArray(shortcut)) {
    shortcut = shortcut.join("");
  }

  shortcut = shortcut.toUpperCase();

  if (isMacOS()) {
    shortcut = shortcut.replace("META", "⌘").replace("MOD", "⌘");
  }

  shortcut = replaceAll(shortcut, "+", "");
  shortcut = shortcut.replace("SHIFT", "⇧");
  shortcut = shortcut.replace("ALT", "⌥");
  shortcut = shortcut.replace("CTRL", "⌃");
  shortcut = shortcut.replace("ENTER", "↩");
  shortcut = shortcut.replace("SPACE", "␣");
  shortcut = shortcut.replace("BACKSPACE", "⌫");
  shortcut = shortcut.replace("DELETE", "⌦");
  shortcut = shortcut.replace("ESCAPE", "⎋");
  shortcut = shortcut.replace("TAB", "⇥");
  shortcut = shortcut.replace("PAGEUP", "PgUp");
  shortcut = shortcut.replace("PAGEDOWN", "PgDn");
  shortcut = shortcut.replace("UP", "↑");
  shortcut = shortcut.replace("DOWN", "↓");
  shortcut = shortcut.replace("LEFT", "←");
  shortcut = shortcut.replace("RIGHT", "→");
  shortcut = shortcut.replace("COMMA", ",");
  return shortcut;
};
