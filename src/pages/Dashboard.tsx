import { BookOpen, Flame, PenLine, Settings as SettingsIcon, ShieldCheck } from 'lucide-react'
import { CompletedTodayCard } from '../components/CompletedTodayCard'
import { ReviewWidget } from '../components/ReviewWidget'
import { getTodaysWriting } from '../data/prompts'
import { useDailyLock } from '../hooks/useDailyLock'
import { useIsAdmin } from '../hooks/useIsAdmin'
import { useAdminAlwaysWrite } from '../hooks/useAdminAlwaysWrite'
import { formatKoreanDate } from '../utils/date'
import { getStreak } from '../utils/archive'
import { trackEvent } from '../lib/analytics'
import type { Session } from '@supabase/supabase-js'
import type { Category, DraftEntry, WritingPrompt } from '../types'

interface Props {
  session: Session
  entries: DraftEntry[]
  onStartWriting: (category: Category, prompt: WritingPrompt) => void
  onOpenArchive: () => void
  onOpenSettings: () => void
  onOpenAdmin: () => void
  onViewEntry: (entry: DraftEntry) => void
}

// Page 1: 오늘 날짜에 맞는 '오늘의 글감' 하나를 자동으로 추천해 보여주는 대시보드
// (카테고리도 매일 결정론적으로 바뀌어 유저가 직접 고르지 않는다 — 워들처럼 "그날의 글감 하나").
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
  const { isLockedToday, completedEntry, remainingMs } = useDailyLock(entries)
  const today = new Date()
  const { category, prompt } = getTodaysWriting(today)
  const isAdmin = useIsAdmin(session.user.id)
  const [alwaysWrite] = useAdminAlwaysWrite()
  const streak = getStreak(entries)
  const showLockedCard = isLockedToday && !(isAdmin && alwaysWrite)

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
          {streak === 0 && (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              매일 1,000자, 짧은 글감 하나면 충분해요.
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1">
          <button
            type="button"
            onClick={onOpenArchive}
            title="내가 쓴 글"
            aria-label="내가 쓴 글"
            className="flex items-center justify-center rounded-full p-2.5 text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <BookOpen size={18} strokeWidth={1.75} />
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              title="관리자"
              aria-label="관리자"
              className="flex items-center justify-center rounded-full p-2.5 text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
            >
              <ShieldCheck size={18} strokeWidth={1.75} />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            title="설정"
            aria-label="설정"
            className="flex items-center justify-center rounded-full p-2.5 text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <SettingsIcon size={18} strokeWidth={1.75} />
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
        <section className="animate-fade-in rounded-2xl border border-paper-line bg-paper-cream/60 p-8 text-center shadow-paper sm:p-10">
          <PenLine size={20} strokeWidth={1.5} className="mx-auto text-accent-indigo" />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            하루 1,000자 이상 작성하면 오늘 글쓰기를 완료할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => {
              trackEvent('writing_started', { category, prompt_id: prompt.id })
              onStartWriting(category, prompt)
            }}
            className="mt-6 rounded-full bg-ink px-7 py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
          >
            시작하기
          </button>
        </section>
      )}

      <ReviewWidget session={session} />
    </div>
  )
}
