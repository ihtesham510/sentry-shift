import { useContext } from "react"
import { themeContext } from "@/context/theme"

export function useTheme() {
	const ctx = useContext(themeContext)
	if (!ctx)
		throw new Error(
			"theme context must be used inside the theme context provider",
		)
	return ctx
}
