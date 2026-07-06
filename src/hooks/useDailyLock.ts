import { useEffect, useState } from 'react'
import { msUntilNextMidnight, toISODate } from '../utils/date'
import type { DraftEntry } from '../types'

// 오늘 이미 목표를 달성해 완료 처리된 초고가 있는지 확인하고, 자정까지 남은
// 시간을 1초 단위로 갱신해준다. 완료된 날에는 대시보드에서 새 글쓰기를 잠근다.
export function useDailyLock(entries: DraftEntry[]) {
  const today = toISODate(new Date())
  const [remainingMs, setRemainingMs] = useState(() => msUntilNextMidnight())

  useEffect(() => {
    const timer = setInterval(() => setRemainingMs(msUntilNextMidnight()), 1000)
    return () => clearInterval(timer)
  }, [])

  const completedEntry: DraftEntry | null =
    entries.find((entry) => entry.date === today && entry.completed) ?? null

  return {
    isLockedToday: completedEntry !== null,
    completedEntry,
    remainingMs,
  }
}
