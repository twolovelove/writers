import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'
import { pushEntry } from '../lib/entries'
import type { Category, DraftEntry, FeedbackItem } from '../types'

const GOAL_CHARS = 1000

// 특정 날짜 + 카테고리의 초고(제목 + 본문)를 다루는 훅. 타이핑이 멈춘 뒤 1초 후
// Supabase에 자동 저장하고, 글자 수 계산과 목표 달성 여부도 함께 관리한다.
// 초기값은 App 레벨에서 이미 불러와 둔 entries 캐시에서 전달받고(initialEntry),
// 저장이 끝나면 서버가 돌려준 최신 상태로 그 캐시를 갱신한다(onSaved).
export function useDraft(
  date: string,
  category: Category,
  promptId: string,
  userId: string,
  initialEntry: DraftEntry | null,
  onSaved: (entry: DraftEntry) => void,
) {
  const [title, setTitle] = useState(initialEntry?.title ?? '')
  const [content, setContent] = useState(initialEntry?.content ?? '')
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(initialEntry?.feedback ?? null)
  const debounced = useDebounce({ title, content }, 1000)
  const isFirstRun = useRef(true)

  // 날짜/카테고리가 바뀌면 해당 초고로 다시 맞춘다
  useEffect(() => {
    setTitle(initialEntry?.title ?? '')
    setContent(initialEntry?.content ?? '')
    setFeedback(initialEntry?.feedback ?? null)
    isFirstRun.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, category])

  const persist = useCallback(
    async (nextTitle: string, nextContent: string, nextFeedback: FeedbackItem[] | null) => {
      // 제목도 본문도 비어 있으면 저장할 게 없다 — 글감만 열어보고 아무것도 안 쓴 채
      // 나가도 "쓴 글" 목록에 빈 항목이 생기지 않게 여기서 막는다.
      if (!nextTitle.trim() && !nextContent.trim()) return
      const charCount = nextContent.length
      const entry: DraftEntry = {
        date,
        category,
        promptId,
        title: nextTitle,
        content: nextContent,
        charCount,
        completed: charCount >= GOAL_CHARS,
        updatedAt: new Date().toISOString(),
        ...(nextFeedback ? { feedback: nextFeedback } : {}),
      }
      const saved = await pushEntry(userId, entry)
      onSaved(saved ?? entry)
    },
    [date, category, promptId, userId, onSaved],
  )

  // 디바운스된 내용이 바뀔 때만 실제 저장을 수행 (첫 로드 시에는 저장 생략)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    persist(debounced.title, debounced.content, feedback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  // 디바운스를 기다리지 않고 즉시 저장 (예: '오늘의 글쓰기 완료' 버튼 클릭 시)
  const saveNow = useCallback(() => {
    persist(title, content, feedback)
  }, [persist, title, content, feedback])

  // 첨삭 노트를 생성한 뒤 초고와 함께 저장해, 지난 글 보기에서도 다시 볼 수 있게 한다
  const saveFeedback = useCallback(
    (items: FeedbackItem[]) => {
      setFeedback(items)
      persist(title, content, items)
    },
    [persist, title, content],
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
    saveNow,
    feedback,
    saveFeedback,
  }
}
