import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await authClient.getSession(),
});

function Home() {
	const data = Route.useLoaderData();
	const isAuthenticated = !!data.data?.user;
	const router = useRouter();

	return (
		<div className="flex items-center justify-center">
			<Button
				onClick={() =>
					router.navigate({ to: isAuthenticated ? "/dashboard" : "/sign-up" })
				}
			>
				{isAuthenticated ? "Go To Dashboard" : "Sign Up"}
			</Button>
		</div>
	);
}
