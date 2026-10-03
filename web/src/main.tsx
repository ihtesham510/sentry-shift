import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/context/theme"
import { routeTree } from "./routeTree.gen"

const queryClient = new QueryClient()

const router = createRouter({
	routeTree,
	context: { queryClient },
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

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<RouterProvider router={router} />)
}
