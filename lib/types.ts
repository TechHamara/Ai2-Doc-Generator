export interface DocumentationResult {
  success: boolean
  message: string
  documentation?: string
}

export interface FileProcessingError {
  error: string
  details?: string
}

