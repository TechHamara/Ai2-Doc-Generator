import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function InfoBanner() {
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-6">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm text-blue-800">
        
      </AlertDescription>
    </Alert>
  )
}

