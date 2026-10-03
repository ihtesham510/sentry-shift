import { useLocalStorage } from "@mantine/hooks"
import {
	createContext,
	type PropsWithChildren,
	useEffect,
	useEffectEvent,
} from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContext {
	theme: Theme
	setTheme: (val: Theme | ((prevState: Theme) => Theme)) => void
}
export const themeContext = createContext<ThemeContext | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useLocalStorage<Theme>({
		key: "theme",
		defaultValue: "system",
	})

	const onThemeChange = useEffectEvent(() => {
		const isDarkMode =
			window.matchMedia("(prefers-color-scheme: dark)").matches ||
			theme === "dark"
		document.documentElement.classList[isDarkMode ? "add" : "remove"]("dark")
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Theme dependency is required here>
	useEffect(() => {
		onThemeChange()
	}, [theme])

	return (
		<themeContext.Provider value={{ theme, setTheme }}>
			{children}
		</themeContext.Provider>
	)
}
