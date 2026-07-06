import { useCallback, useEffect, useState } from 'react'
import { pullEntries } from '../lib/entries'
import { captureError } from '../lib/monitoring'
import type { DraftEntry } from '../types'

function entryKey(entry: { date: string; category: string }) {
  return `${entry.date}:${entry.category}`
}

// 최신 날짜 먼저, 같은 날짜면 카테고리 오름차순
function sortEntries(entries: DraftEntry[]): DraftEntry[] {
  return [...entries].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.category.localeCompare(b.category)
  })
}

// Supabase가 글의 유일한 저장소다. 로그인 시점에 이 계정의 모든 글을 한 번 불러와
// 화면들(대시보드/아카이브/모음집/에디터)이 공유하는 캐시로 들고 있다가,
// 에디터에서 저장이 일어나면 upsertEntry로 캐시만 갱신해 재조회 없이 화면에 반영한다.
export function useEntries(userId: string | null) {
  const [entries, setEntries] = useState<DraftEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setEntries([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    pullEntries(userId)
      .then((remote) => {
        if (!cancelled) setEntries(sortEntries(remote))
      })
      .catch((error) => {
        captureError(error, { where: 'useEntries', userId })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const upsertEntry = useCallback((entry: DraftEntry) => {
    setEntries((prev) => {
      const key = entryKey(entry)
      const index = prev.findIndex((e) => entryKey(e) === key)
      if (index === -1) return sortEntries([...prev, entry])
      const next = [...prev]
      next[index] = entry
      return next
    })
  }, [])

  return { entries, loading, upsertEntry }
}
