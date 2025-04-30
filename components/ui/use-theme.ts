import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme } = useNextTheme()
  return theme || "light"
} 