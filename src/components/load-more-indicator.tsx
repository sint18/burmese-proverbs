import { Loader2 } from "lucide-react"

export function LoadMoreIndicator() {
  return (
    <div className="flex items-center justify-center py-6">
      <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
      <span className="text-purple-300">Loading more proverbs...</span>
    </div>
  )
}
