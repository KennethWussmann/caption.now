import { settings } from "@/lib/settings"
import { useAtom } from "jotai/react"

export const useTextReplacements = () => {
  const [replacements, setReplacements] = useAtom(settings.tools.textReplacement.replacements)

  const upsertReplacement = (from: string, to: string) => {
    const existing = replacements.find((r) => r.from === from)
    if (existing) {
      // update existing replacement
      setReplacements(replacements.map((r) => (r.from === from ? { from, to } : r)))
      return
    } else {
      setReplacements([...replacements, { from, to }])
    }
  }
  
  const removeReplacement = (from: string) => {
    setReplacements(replacements.filter((r) => r.from !== from))
  }

  return {
    replacements,
    upsertReplacement,
    removeReplacement,
  }
}