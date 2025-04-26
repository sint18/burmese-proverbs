import { Loader2 } from "lucide-react"

export function WormholeLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
      <p className="text-lg text-purple-300">Searching Proverbs...</p>
    </div>
  )
}
