import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
