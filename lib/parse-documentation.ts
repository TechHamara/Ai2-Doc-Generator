interface DocumentationCounts {
  events: number
  methods: number
  setters: number
}

export function parseDocumentation(documentation: string): DocumentationCounts {
  const counts: DocumentationCounts = {
    events: 0,
    methods: 0,
    setters: 0,
  }

  const lines = documentation.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("## <kbd>Events:</kbd>")) {
      const match = lines[i].match(/total (\d+) events/)
      if (match) {
        counts.events = Number.parseInt(match[1], 10)
      }
    } else if (lines[i].includes("## <kbd>Methods:</kbd>")) {
      const match = lines[i].match(/total (\d+) methods/)
      if (match) {
        counts.methods = Number.parseInt(match[1], 10)
      }
    } else if (lines[i].includes("## <kbd>Setters:</kbd>")) {
      const match = lines[i].match(/total (\d+) setter/)
      if (match) {
        counts.setters = Number.parseInt(match[1], 10)
      }
    }
  }

  return counts
}

