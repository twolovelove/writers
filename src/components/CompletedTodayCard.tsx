import { CheckCircle2, Hourglass } from 'lucide-react'
import { formatDuration } from '../utils/date'
import type { DraftEntry } from '../types'

interface Props {
  entry: DraftEntry
  remainingMs: number
  onView: () => void
}

// 오늘 글쓰기를 이미 완료했을 때 대시보드에 대신 노출되는 카드.
// 새 글쓰기는 잠기고, 다음 글감이 열리기까지 남은 시간을 보여준다.
export function CompletedTodayCard({ entry, remainingMs, onView }: Props) {
  return (
    <div className="animate-fade-in rounded-2xl border border-paper-line bg-paper-cream/60 p-8 text-center shadow-paper sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/15 text-accent-green">
        <CheckCircle2 size={24} strokeWidth={1.75} />
      </div>

      <h2 className="mt-5 text-xl text-ink">오늘의 글쓰기를 완료했어요</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        오늘 {entry.charCount.toLocaleString()}자를 채웠어요. 내일 새로운 글로 다시 만나요.
      </p>

      <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm text-ink-soft">
        <Hourglass size={15} strokeWidth={1.75} className="text-accent-indigo" />
        다음 창작까지{' '}
        <span className="font-medium tabular-nums text-ink">{formatDuration(remainingMs)}</span>
      </div>

      <button
        type="button"
        onClick={onView}
        className="mt-7 rounded-full bg-ink px-6 py-2.5 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
      >
        오늘 쓴 글 보기
      </button>
    </div>
  )
}
