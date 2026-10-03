import { queryOptions } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"

export const authQuery = queryOptions({
	queryKey: ["session"],
	queryFn: async () => {
		const session = await authClient.getSession()
		return session.data
	},
	staleTime: 1000 * 60 * 5,
})

export const sitesQuries = {
	all: ["sites"],
}
