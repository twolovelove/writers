import { useState } from 'react'
import { BookOpen, Flame, Settings as SettingsIcon, ShieldCheck } from 'lucide-react'
import { CategorySelector } from '../components/CategorySelector'
import { PromptCard } from '../components/PromptCard'
import { CompletedTodayCard } from '../components/CompletedTodayCard'
import { ReviewWidget } from '../components/ReviewWidget'
import { getPromptForDate } from '../data/prompts'
import { useDailyLock } from '../hooks/useDailyLock'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { useAdminAlwaysWrite } from '../hooks/useAdminAlwaysWrite'
import { formatKoreanDate } from '../utils/date'
import { getStreak } from '../utils/archive'
import { trackEvent } from '../lib/analytics'
import type { Session } from '@supabase/supabase-js'
import type { Category, DraftEntry, WritingPrompt } from '../types'

const LAST_CATEGORY_KEY = 'writer:lastCategory'

interface Props {
  session: Session
  entries: DraftEntry[]
  onStartWriting: (category: Category, prompt: WritingPrompt) => void
  onOpenArchive: () => void
  onOpenSettings: () => void
  onOpenAdmin: () => void
  onViewEntry: (entry: DraftEntry) => void
}

// Page 1: 오늘 날짜와 카테고리를 고르면 그에 맞는 '오늘의 글감'을 보여주는 대시보드.
// 오늘 이미 목표를 채웠다면 새 글쓰기 대신 완료 카드와 다음 글감까지 남은 시간을 보여준다.
export function Dashboard({
  session,
  entries,
  onStartWriting,
  onOpenArchive,
  onOpenSettings,
  onOpenAdmin,
  onViewEntry,
}: Props) {
  const [category, setCategory] = useState<Category>(
    () => (localStorage.getItem(LAST_CATEGORY_KEY) as Category | null) ?? '자유주제',
  )
  const { isLockedToday, completedEntry, remainingMs } = useDailyLock(entries)
  const today = new Date()
  const prompt = getPromptForDate(today, category)
  const isAdmin = useIsAdmin(session.user.id)
  const [alwaysWrite] = useAdminAlwaysWrite()
  const streak = getStreak(entries)
  const showLockedCard = isLockedToday && !(isAdmin && alwaysWrite)

  const handleSelectCategory = (next: Category) => {
    setCategory(next)
    localStorage.setItem(LAST_CATEGORY_KEY, next)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:py-20">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm tracking-widest text-ink-soft">{formatKoreanDate(today)}</p>
          <h1 className="mt-2 text-3xl text-ink sm:text-4xl">오늘의 글쓰기</h1>
          {streak > 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs text-accent-indigo">
              <Flame size={14} strokeWidth={1.75} />
              {streak}일째 연속 작성 중
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            매일 1,000자, 짧은 글감 하나면 충분합니다. 오늘은 어떤 글을 써볼까요?
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          <button
            type="button"
            onClick={onOpenArchive}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <BookOpen size={15} strokeWidth={1.75} />
            내가 쓴 글
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
            >
              <ShieldCheck size={15} strokeWidth={1.75} />
              관리자
            </button>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <SettingsIcon size={15} strokeWidth={1.75} />
            설정
          </button>
        </div>
      </header>

      {showLockedCard && completedEntry ? (
        <CompletedTodayCard
          entry={completedEntry}
          remainingMs={remainingMs}
          onView={() => onViewEntry(completedEntry)}
        />
      ) : (
        <>
          <section className="mb-8">
            <CategorySelector selected={category} onSelect={handleSelectCategory} />
          </section>

          <section>
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onStart={() => {
                trackEvent('writing_started', { category, prompt_id: prompt.id })
                onStartWriting(category, prompt)
              }}
            />
          </section>
        </>
      )}

      <ReviewWidget session={session} />
    </div>
  )
}
