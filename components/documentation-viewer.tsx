"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { parseDocumentation } from "@/lib/parse-documentation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentationViewerProps {
  documentation: string
}

export function DocumentationViewer({ documentation }: DocumentationViewerProps) {
  const { toast } = useToast()
  const counts = parseDocumentation(documentation)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(documentation)
    toast({
      title: "Copied to clipboard",
      description: "Documentation has been copied to your clipboard",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([documentation], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "documentation.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">Generated Documentation</CardTitle>
        <CardDescription>
          This documentation contains {counts.events} event{counts.events !== 1 ? "s" : ""}, {counts.methods} method
          {counts.methods !== 1 ? "s" : ""}, and {counts.setters} setter{counts.setters !== 1 ? "s" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <ScrollArea className="h-[400px] w-full rounded border p-4">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatDocumentation(documentation) }} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function formatDocumentation(documentation: string): string {
  // Convert Markdown to HTML
  let html = documentation
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/!\[(.*?)\]$$(.*?)$$/gim, "<img alt='$1' src='$2' class='max-w-full h-auto' />")
    .replace(/\[(.*?)\]$$(.*?)$$/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />")

  // Replace <kbd> tags
  html = html.replace(
    /<kbd>(.*?)<\/kbd>/g,
    '<span class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">$1</span>',
  )

  // Add custom styles for the centered content
  html = html.replace('<div align="center">', '<div class="text-center">')

  // Add emoji styles
  html = html.replace(/🧩|💾|⚙️|📱|📅|💻/g, '<span class="text-2xl">$&</span>')

  return html
}

