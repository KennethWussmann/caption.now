import { useLocation } from "react-router-dom"

export const useAction = () => {
  const { pathname } = useLocation()
  if (pathname.includes("caption")) {
    return "caption" as const
  } else if (pathname.includes("sort")) {
    return "sort" as const
  }
  return null
}