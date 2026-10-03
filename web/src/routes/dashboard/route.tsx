import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { AppSideBar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	async beforeLoad({ context: { session } }) {
		if (!session) {
			throw redirect({
				to: "/sign-in",
			})
		}
		return { user: session.user }
	},
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSideBar />
			<Outlet />
		</SidebarProvider>
	)
}
