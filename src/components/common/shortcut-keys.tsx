import { settings, Settings } from "@/lib/settings"
import { replaceShortcutSymbols } from "@/lib/utils"
import clsx from "clsx"
import { useAtom } from "jotai/react"
import { useMemo } from "react"

type ShortcutKeysProps = {
  settingsKey: keyof Settings["shortcuts"]
} & Partial<Pick<HTMLSpanElement, "className">>

export const ShortcutKeys = ({ settingsKey, className }: ShortcutKeysProps) => {
  const [shortcut] = useAtom(settings.shortcuts[settingsKey])
  const symbolizedShortcut = useMemo(() => replaceShortcutSymbols(shortcut), [shortcut])


  return (
    <span className={clsx("p-1 border bg-muted rounded-md m-1 font-mono", className)}>
      {symbolizedShortcut}
    </span>
  )
}