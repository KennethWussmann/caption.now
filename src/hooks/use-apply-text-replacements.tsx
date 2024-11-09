import { settings } from "@/lib/settings"
import { useAtom } from "jotai/react"
import { useState } from "react"

export const useApplyTextReplacements = () => {
  const [isEnabled] = useAtom(settings.tools.textReplacement.enabled)
  const [replacements] = useAtom(settings.tools.textReplacement.replacements)
  const [value, setValue] = useState("")

  const applyTextReplacement = (input: string) => {
    let newValue = input
    if (isEnabled) {
      replacements.forEach((replacement) => {
        const pattern = new RegExp(`${replacement.from}\\s$`)
        newValue = newValue.replace(pattern, replacement.to + " ")
      })
    }
    setValue(newValue)
  }

  return [value, applyTextReplacement] as const
}
