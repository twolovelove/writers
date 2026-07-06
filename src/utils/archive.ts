import { PROMPTS } from '../data/prompts'
import { toISODate } from './date'
import type { DraftEntry } from '../types'

const PREFIX = 'writer:draft:'

function storageKey(entry: Pick<DraftEntry, 'date' | 'category'>) {
  return `${PREFIX}${entry.date}:${entry.category}`
}

// 사용자가 직접 붙인 제목이 있으면 그것을, 없으면 글감 제목을 대신 보여준다
export function displayTitle(entry: DraftEntry): string {
  if (entry.title.trim()) return entry.title.trim()
  return PROMPTS.find((p) => p.id === entry.promptId)?.title ?? '글감 정보 없음'
}

// LocalStorage에 흩어져 있는 모든 초고를 모아 최신 날짜순으로 정렬해 반환
export function getAllDrafts(): DraftEntry[] {
  const entries: DraftEntry[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(PREFIX)) continue
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      entries.push(JSON.parse(raw) as DraftEntry)
    } catch {
      continue
    }
  }

  return entries
    .filter((entry) => entry.content.trim().length > 0)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1
      return a.category.localeCompare(b.category)
    })
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

// 서버에서 받아온 글이 이 기기의 글보다 최신이면 LocalStorage에 반영한다
export function applyNewerRemoteEntry(remote: DraftEntry, local: DraftEntry | null) {
  if (local && local.updatedAt >= remote.updatedAt) return
  localStorage.setItem(storageKey(remote), JSON.stringify(remote))
}
