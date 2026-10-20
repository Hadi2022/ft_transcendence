import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'

type ApiStatus = {
  status: string
}

export default function Index() {
  const [status, setStatus] = useState<string>('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<ApiStatus>('/status')
      .then((data) => {
        setStatus(data.status)
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Unknown error'
        )
      })
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">
        Frontend-Backend Communication
      </h1>

      {error ? (
        <p className="mt-4 text-red-500">
          Error: {error}
        </p>
      ) : (
        <p className="mt-4">
          Backend status: {status}
        </p>
      )}
    </main>
  )
}
