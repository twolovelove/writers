import { useEffect, useState } from 'react'

// 값이 delay(ms) 동안 더 이상 바뀌지 않을 때만 최신 값을 반환하는 디바운스 훅
export function useDebounce<T>(value: T, delay = 1000): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
