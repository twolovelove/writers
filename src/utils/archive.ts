import type { DraftEntry } from '../types'

const PREFIX = 'writer:draft:'

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
