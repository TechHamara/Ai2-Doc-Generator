import { type NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const platform = formData.get("platform") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const zip = new JSZip()

    if (file.name.endsWith(".aix") || file.name.endsWith(".aia")) {
      const zipContents = await zip.loadAsync(arrayBuffer)
      const docs = await generateDocs(zipContents, platform)

      return NextResponse.json({
        success: true,
        message: "Documentation generated successfully",
        documentation: docs,
      })
    } else if (file.name.endsWith(".jar")) {
      const jarDocs = await processJarFile(arrayBuffer)

      return NextResponse.json({
        success: true,
        message: "Documentation generated successfully",
        documentation: jarDocs,
      })
    }

    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

async function generateDocs(zipContents: JSZip, platform: string): Promise<string> {
  let documentation = ""

  if (platform === "appinventor") {
    const componentFiles = Object.keys(zipContents.files).filter((filename) => filename.endsWith("components.json"))

    for (const filename of componentFiles) {
      const file = zipContents.files[filename]
      if (file) {
        const content = await file.async("string")
        const componentData = JSON.parse(content)
        documentation += formatComponentDocs(componentData)
      }
    }
  }

  return documentation || "No documentation content found in the file."
}

async function processJarFile(arrayBuffer: ArrayBuffer): Promise<string> {
  // This is a placeholder for JAR file processing
  return "JAR file documentation (implementation needed)"
}

function formatComponentDocs(componentData: any[]): string {
  let docs = ""

  for (const component of componentData) {
    docs += `# ${component.name}\n\n`

    if (component.helpString) {
      docs += `${component.helpString}\n\n`
    }

    if (component.properties && component.properties.length > 0) {
      docs += "## Properties\n\n"
      for (const prop of component.properties) {
        docs += `- **${prop.name}**: ${prop.description || "No description available"}\n`
      }
      docs += "\n"
    }

    if (component.events && component.events.length > 0) {
      docs += "## Events\n\n"
      for (const event of component.events) {
        docs += `### ${event.name}\n`
        docs += `${event.description || "No description available"}\n\n`
      }
    }

    if (component.methods && component.methods.length > 0) {
      docs += "## Methods\n\n"
      for (const method of component.methods) {
        docs += `### ${method.name}\n`
        docs += `${method.description || "No description available"}\n\n`
        if (method.params && method.params.length > 0) {
          docs += "Parameters:\n"
          for (const param of method.params) {
            docs += `- ${param.name} (${param.type})\n`
          }
        }
        docs += "\n"
      }
    }

    docs += "---\n\n"
  }

  return docs
}

