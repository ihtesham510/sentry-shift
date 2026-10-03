import { Link, type LinkProps } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"
import type * as React from "react"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string
		link: LinkProps
		icon: LucideIcon
	}[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<Link {...item.link}>
								{({ isActive }) => (
									<SidebarMenuButton isActive={isActive}>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								)}
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
