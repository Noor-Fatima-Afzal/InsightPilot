import { useState, useEffect } from 'react'

export function useStreamedResponse(sessionId: string | null) {
  const [messages, setMessages] = useState<any[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const connect = async () => {
      try {
        setIsStreaming(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/research/stream/${sessionId}`
        )

        if (!response.body) return

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                setMessages((prev) => [...prev, data])
              } catch (e) {
                // Invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error('Stream error:', error)
      } finally {
        setIsStreaming(false)
      }
    }

    connect()
  }, [sessionId])

  return { messages, isStreaming }
}
