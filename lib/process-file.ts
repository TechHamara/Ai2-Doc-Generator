import type { DocumentationResult } from "./types"
import JSZip from "jszip"

export async function processFile(file: File, platform: string): Promise<DocumentationResult> {
  try {
    if (!file) {
      throw new Error("No file selected")
    }

    const validExtensions = [".aix", ".aia", ".jar"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      throw new Error("Invalid file type. Please upload .aix, .aia, or .jar files only.")
    }

    const arrayBuffer = await file.arrayBuffer()
    const zip = new JSZip()

    if (fileExtension === ".aix" || fileExtension === ".aia") {
      const zipContents = await zip.loadAsync(arrayBuffer)
      const docs = await generateDocs(zipContents, platform)
      return {
        success: true,
        message: "Documentation generated successfully",
        documentation: docs,
      }
    } else if (fileExtension === ".jar") {
      const jarDocs = await processJarFile(arrayBuffer)
      return {
        success: true,
        message: "Documentation generated successfully",
        documentation: jarDocs,
      }
    }

    throw new Error("Unsupported file type")
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("An unexpected error occurred")
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
        documentation += await formatComponentDocs(componentData, zipContents)
      }
    }
  }

  return documentation || "No documentation content found in the file."
}

async function processJarFile(arrayBuffer: ArrayBuffer): Promise<string> {
  // This is a placeholder for JAR file processing
  return "JAR file documentation (implementation needed)"
}

async function formatComponentDocs(componentData: any[], zipContents: JSZip): Promise<string> {
  let eventCount = 0
  let methodCount = 0
  let setterCount = 0

  // Count events, methods, and setters
  for (const component of componentData) {
    eventCount += component.events?.length || 0
    methodCount += component.methods?.length || 0
    setterCount += component.properties?.filter((prop: any) => prop.setter).length || 0
  }

  let docs = `## <kbd>Events:</kbd>\n**ScreenLock** has total ${eventCount} events.\n\n`
  docs += `## <kbd>Methods:</kbd>\n**ScreenLock** has total ${methodCount} methods.\n\n`
  docs += `## <kbd>Setters:</kbd>\n**ScreenLock** has total ${setterCount} setter properties.\n\n`

  for (const component of componentData) {
    docs += `# ${component.name}\n\n`

    if (component.helpString) {
      docs += `${component.helpString}\n\n`
    }

    if (component.properties && component.properties.length > 0) {
      docs += "## Properties\n\n"
      for (const prop of component.properties) {
        docs += `- **${prop.name}**: ${prop.description || "No description available"}\n`
        if (prop.setter) {
          const blockImage = await getBlockImage(zipContents, `${component.name}_${prop.name}_setter`)
          if (blockImage) {
            docs += `\n  ![${prop.name} Setter](data:image/png;base64,${blockImage})\n`
          }
        }
      }
      docs += "\n"
    }

    if (component.events && component.events.length > 0) {
      docs += "## Events\n\n"
      for (const event of component.events) {
        docs += `### ${event.name}\n`
        docs += `${event.description || "No description available"}\n\n`
        const blockImage = await getBlockImage(zipContents, `${component.name}_${event.name}`)
        if (blockImage) {
          docs += `![${event.name} Event](data:image/png;base64,${blockImage})\n\n`
        }
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
          docs += "\n"
        }
        const blockImage = await getBlockImage(zipContents, `${component.name}_${method.name}`)
        if (blockImage) {
          docs += `![${method.name} Method](data:image/png;base64,${blockImage})\n\n`
        }
      }
    }

    docs += "---\n\n"
  }

  return docs
}

async function getBlockImage(zipContents: JSZip, blockName: string): Promise<string | null> {
  const imagePath = `assets/${blockName}.png`
  const imageFile = zipContents.file(imagePath)

  if (imageFile) {
    const imageArrayBuffer = await imageFile.async("arraybuffer")
    const base64Image = Buffer.from(imageArrayBuffer).toString("base64")
    return base64Image
  }

  return null
}

