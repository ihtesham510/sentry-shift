import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { Loader } from "@/components/common/loader"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/context/theme"
import { authClient } from "@/lib/auth-client"
import { routeTree } from "./routeTree.gen"

const queryClient = new QueryClient()

const router = createRouter({
	routeTree,
	context: undefined!,
	scrollRestoration: true,
	defaultPreloadStaleTime: 0,
	Wrap: ({ children }) => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	),
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("app")!

function App() {
	const queryClient = useQueryClient()
	return (
		<RouterProvider
			context={{
				queryClient,
			}}
			router={router}
		/>
	)
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<TooltipProvider>
					<App />
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>,
	)
}
