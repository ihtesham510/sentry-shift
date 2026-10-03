import { LoaderCircle } from "lucide-react"

export function Loader() {
	return (
		<div className="flex items-center justify-center h-screen w-full">
			<LoaderCircle className="animate-spin" size={28} />
		</div>
	)
}
