import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function ApplicationDetailLoading() {
  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" disabled className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Skeleton className="h-8 w-48" />
      </div>

      <Skeleton className="h-48 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-6">
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-96" />
          </div>
        </div>
        <div>
          <Skeleton className="h-64 mb-6" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}