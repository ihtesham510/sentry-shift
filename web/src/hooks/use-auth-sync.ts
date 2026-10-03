import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useEffectEvent } from "react"
import { authClient } from "@/lib/auth-client"

export function useAuthSync() {
	const queryClient = useQueryClient()
	const { data: session, isPending } = authClient.useSession()

	const onSessionChange = useEffectEvent(() => {
		queryClient.setQueryData(["session"], session)
	})
	// biome-ignore lint/correctness/useExhaustiveDependencies: <need more dependencies to update query data>
	useEffect(() => {
		if (!isPending) {
			onSessionChange()
		}
	}, [session, isPending])
}
