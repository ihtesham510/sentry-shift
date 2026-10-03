import type { LinkProps } from "@tanstack/react-router"
import {
	BuildingComplex,
	ClockIcon,
	HomeIcon,
	type LucideIcon,
	UsersIcon,
} from "lucide-react"

export interface LinkItem {
	title: string
	link: LinkProps
	icon: LucideIcon
}

interface Navs {
	main_nav: LinkItem[]
	secondary_nav: LinkItem[]
}

export const navs: Navs = {
	main_nav: [
		{
			title: "Dashboard",
			icon: HomeIcon,
			link: {
				to: "/dashboard",
				activeOptions: {
					exact: true,
				},
			},
		},
		{
			title: "Shifts",
			icon: ClockIcon,
			link: {
				to: "/dashboard/shifts",
			},
		},
		{
			title: "Employees",
			icon: UsersIcon,
			link: {
				to: "/dashboard/employees",
			},
		},
		{
			title: "Companies",
			icon: BuildingComplex,
			link: {
				to: "/dashboard/company",
			},
		},
	],
	secondary_nav: [],
}
