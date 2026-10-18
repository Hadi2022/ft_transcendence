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
  let response: Response

  try {
    response = await fetch(`/api${path}`)
  } catch {
    throw new ApiRequestError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to the backend'
    )
  }

  let body: ApiSuccess<T> | ApiFailure

  try {
    body = await response.json()
  } catch {
    throw new ApiRequestError(
      response.status,
      'INVALID_RESPONSE',
      'The backend returned an invalid JSON response'
    )
  }

  if (!response.ok) {
    if ('error' in body && body.error) {
      throw new ApiRequestError(
        response.status,
        body.error.code,
        body.error.message,
        body.error.details
      )
    }

    throw new ApiRequestError(
      response.status,
      'HTTP_ERROR',
      `HTTP error ${response.status}`
    )
  }

  if (!('data' in body)) {
    throw new ApiRequestError(
      response.status,
      'INVALID_RESPONSE',
      'The API response is missing the data field'
    )
  }

  return body.data
}
