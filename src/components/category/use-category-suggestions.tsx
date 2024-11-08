import { useDatabase } from "@/lib/database/database-provider"
import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"

export const useCategorySuggestions = (input: string) => {
  const { database } = useDatabase()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const debouncedInput = useDebounce(input, 300)

  const selectPrevious = () => {
    if (selected === null) {
      setSelected(suggestions[suggestions.length - 1])
    } else {
      const index = suggestions.indexOf(selected)
      setSelected(suggestions[(index - 1 + suggestions.length) % suggestions.length])
    }
  }

  const selectNext = () => {
    if (selected === null) {
      setSelected(suggestions[0])
    } else {
      const index = suggestions.indexOf(selected)
      setSelected(suggestions[(index + 1) % suggestions.length])
    }
  }

  const sanitizeValue = (value: string) =>
    value.trim().toLowerCase()

  useEffect(() => {
    const sanitizedInput = sanitizeValue(debouncedInput)

    if (sanitizedInput === "") {
      return
    }
    setLoading(true)
    setSuggestions([])
    setSelected(null)

    const search = async () => {
      const allImages = await database.images.toArray()
      setSuggestions(
        Array.from(
          new Set(
            allImages
              .flatMap(({ categories }) => categories ?? [])
              .map(({ text }) => text)
              .filter((category) => sanitizeValue(category).includes(sanitizedInput))
          )
        )
      )
      setLoading(false)
    }
    void search()
  }, [debouncedInput])

  useEffect(() => {
    if (input === "") {
      setSuggestions([])
      setSelected(null)
    }
  }, [input])

  return { suggestions, isLoading, selected, selectNext, selectPrevious }
}