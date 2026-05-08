import { useState, useCallback } from 'react'

export function useAsyncOperation<T>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (fn: () => Promise<T>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fn()
      setData(result)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { execute, isLoading, error, data }
}
