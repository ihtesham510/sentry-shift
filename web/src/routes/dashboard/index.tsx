import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
})

function RouteComponent() {
	const { user } = Route.useRouteContext()
	return <div>hellow {user.name}</div>
}
