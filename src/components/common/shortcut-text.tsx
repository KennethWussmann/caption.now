import { settings, Settings } from "@/lib/settings"
import { replaceShortcutSymbols } from "@/lib/utils"
import { useAtom } from "jotai/react"
import { useMemo } from "react"

type ShortcutTextProps = {
  settingsKey: keyof Settings["shortcuts"]
}

export const ShortcutText = ({ settingsKey }: ShortcutTextProps) => {
  const [shortcut] = useAtom(settings.shortcuts[settingsKey])
  const symbolizedShortcut = useMemo(() => replaceShortcutSymbols(shortcut), [shortcut])
  return (
    <>{symbolizedShortcut}</>
  )
}