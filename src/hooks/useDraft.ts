import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'
import type { Category, DraftEntry, FeedbackItem } from '../types'

const GOAL_CHARS = 1000

function storageKey(date: string, category: Category) {
  return `writer:draft:${date}:${category}`
}

function loadDraft(date: string, category: Category): DraftEntry | null {
  try {
    const raw = localStorage.getItem(storageKey(date, category))
    return raw ? (JSON.parse(raw) as DraftEntry) : null
  } catch {
    return null
  }
}

function persistDraft(
  date: string,
  category: Category,
  promptId: string,
  title: string,
  content: string,
  feedback: FeedbackItem[] | null,
): string {
  const charCount = content.length
  const entry: DraftEntry = {
    date,
    category,
    promptId,
    title,
    content,
    charCount,
    completed: charCount >= GOAL_CHARS,
    updatedAt: new Date().toISOString(),
    ...(feedback ? { feedback } : {}),
  }
  localStorage.setItem(storageKey(date, category), JSON.stringify(entry))
  return entry.updatedAt
}

// 특정 날짜 + 카테고리의 초고(제목 + 본문)를 불러오고, 타이핑이 멈춘 뒤 1초 후
// 자동으로 LocalStorage에 저장하는 훅. 글자 수 계산과 목표 달성 여부도 함께 관리한다.
export function useDraft(date: string, category: Category, promptId: string) {
  const [title, setTitle] = useState(() => loadDraft(date, category)?.title ?? '')
  const [content, setContent] = useState(() => loadDraft(date, category)?.content ?? '')
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(
    () => loadDraft(date, category)?.feedback ?? null,
  )
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    () => loadDraft(date, category)?.updatedAt ?? null,
  )
  const debounced = useDebounce({ title, content }, 1000)
  const isFirstRun = useRef(true)

  // 날짜/카테고리가 바뀌면 해당 초고를 다시 불러온다
  useEffect(() => {
    const saved = loadDraft(date, category)
    setTitle(saved?.title ?? '')
    setContent(saved?.content ?? '')
    setFeedback(saved?.feedback ?? null)
    setLastSavedAt(saved?.updatedAt ?? null)
    isFirstRun.current = true
  }, [date, category])

  // 디바운스된 내용이 바뀔 때만 실제 저장을 수행 (첫 로드 시에는 저장 생략)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    setLastSavedAt(persistDraft(date, category, promptId, debounced.title, debounced.content, feedback))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // 디바운스를 기다리지 않고 즉시 저장 (예: '오늘의 글쓰기 완료' 버튼 클릭 시)
  const saveNow = useCallback(() => {
    setLastSavedAt(persistDraft(date, category, promptId, title, content, feedback))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, category, promptId, title, content, feedback])

  // 첨삭 노트를 생성한 뒤 초고와 함께 저장해, 지난 글 보기에서도 다시 볼 수 있게 한다
  const saveFeedback = useCallback(
    (items: FeedbackItem[]) => {
      setFeedback(items)
      setLastSavedAt(persistDraft(date, category, promptId, title, content, items))
    },
    [date, category, promptId, title, content],
  )

  const charCount = content.length
  const progress = Math.min(100, Math.round((charCount / GOAL_CHARS) * 100))
  const isGoalMet = charCount >= GOAL_CHARS

  return {
    title,
    setTitle,
    content,
    setContent,
    charCount,
    goal: GOAL_CHARS,
    progress,
    isGoalMet,
    lastSavedAt,
    saveNow,
    feedback,
    saveFeedback,
  }
}
