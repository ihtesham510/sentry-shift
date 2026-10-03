import { Link, useRouteContext } from "@tanstack/react-router"
import { UserIcon } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { navs } from "./navs"

export function AppSideBar(props: React.ComponentProps<typeof Sidebar>) {
	const { user } = useRouteContext({
		from: "/dashboard",
	})
	if (user)
		return (
			<Sidebar collapsible="offcanvas" {...props}>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								className="data-[slot=sidebar-menu-button]:p-1.5!"
							>
								<Link to="/dashboard">
									<UserIcon className="size-5!" />
									<span className="text-base font-semibold">Acme Inc.</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<NavMain items={navs.main_nav} />
					<NavSecondary items={navs.secondary_nav} />
				</SidebarContent>
				<SidebarFooter>
					<NavUser
						user={{
							name: user.name,
							email: user.email,
							avatar: user.image ?? undefined,
						}}
					/>
				</SidebarFooter>
			</Sidebar>
		)
}
