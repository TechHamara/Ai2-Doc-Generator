"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentationViewer } from "./documentation-viewer"
import { processFile } from "@/lib/process-file"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState<string>("appinventor")
  const [isProcessing, setIsProcessing] = useState(false)
  const [documentation, setDocumentation] = useState<string>("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setDocumentation("") // Clear previous documentation
    }
  }

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate documentation",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const result = await processFile(selectedFile, platform)
      if (result.success && result.documentation) {
        setDocumentation(result.documentation)
        toast({
          title: "Success",
          description: "Documentation generated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate documentation",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Documentation</CardTitle>
        <CardDescription>Upload your file and select the platform to generate documentation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <span className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : "No file chosen"}</span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".aix,.aia,.jar"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button className="w-full sm:w-auto" onClick={handleGenerate} disabled={isProcessing || !selectedFile}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate Documentation"
              )}
            </Button>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appinventor">AppInventor</SelectItem>
                <SelectItem value="other">Other Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {documentation && <DocumentationViewer documentation={documentation} />}
        </div>
      </CardContent>
    </Card>
  )
}

