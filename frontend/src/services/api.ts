export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export class ApiRequestError extends Error {
  status: number
  code: string
  details?: Record<string, unknown>

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message)

    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.details = details
  }
}


type ApiSuccess<T> = {
  data: T
}

type ApiFailure = {
  error: ApiError
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`)

  const body: ApiSuccess<T> | ApiFailure = await response.json()

  if (!response.ok) {
    if ('error' in body) {
      throw new ApiRequestError(
        response.status,
        body.error.code,
        body.error.message,
        body.error.details
      )
    }

    throw new ApiRequestError(
      response.status,
      'UNEXPECTED_ERROR',
      `HTTP error ${response.status}`
    )
  }

  if (!('data' in body)) {
    throw new Error('Invalid API response: missing data field')
  }

  return body.data
}
