import { createFileRoute, redirect } from "@tanstack/react-router"
import { SignInForm } from "@/components/auth/sign-in-form"

export const Route = createFileRoute("/(auth)/sign-in")({
	component: RouteComponent,
	async beforeLoad({ context: { session } }) {
		if (session) {
			throw redirect({
				to: "/dashboard",
			})
		}
	},
})

function RouteComponent() {
	return (
		<main className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-4">
			<SignInForm />
		</main>
	)
}
