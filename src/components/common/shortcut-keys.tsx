import { Settings } from "@/lib/settings"
import clsx from "clsx"
import { ShortcutText } from "./shortcut-text"

type ShortcutKeysProps = {
  settingsKey: keyof Settings["shortcuts"]
} & Partial<Pick<HTMLSpanElement, "className">>

export const ShortcutKeys = ({ settingsKey, className }: ShortcutKeysProps) => {
  return (
    <span className={clsx("p-1 border bg-muted rounded-md m-1 font-mono", className)}>
      <ShortcutText settingsKey={settingsKey} />
    </span>
  )
}