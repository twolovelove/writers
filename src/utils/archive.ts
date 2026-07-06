import { PROMPTS } from '../data/prompts'
import { toISODate } from './date'
import type { DraftEntry } from '../types'

// 사용자가 직접 붙인 제목이 있으면 그것을, 없으면 글감 제목을 대신 보여준다
export function displayTitle(entry: DraftEntry): string {
  if (entry.title.trim()) return entry.title.trim()
  return PROMPTS.find((p) => p.id === entry.promptId)?.title ?? '글감 정보 없음'
}

// 오늘까지 (오늘 아직 완료 전이면 어제까지) 끊기지 않고 이어진 완료일 수를 센다.
// 오늘 하루가 아직 안 끝났다면 아직 완료 못 했다고 바로 스트릭을 끊지 않는다.
export function getStreak(entries: DraftEntry[]): number {
  const completedDates = new Set(entries.filter((entry) => entry.completed).map((entry) => entry.date))
  if (completedDates.size === 0) return 0

  const cursor = new Date()
  if (!completedDates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (completedDates.has(toISODate(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
