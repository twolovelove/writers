import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { renderPreview } from '../utils/textFormat'
import { formatShortKoreanDate } from '../utils/date'
import { displayTitle } from '../utils/archive'
import { FeedbackPanel } from '../components/FeedbackPanel'
import type { DraftEntry } from '../types'

interface Props {
  entry: DraftEntry
  onBack: () => void
}

// Page: 지난 글 또는 오늘 완료한 글을 읽기 전용으로 보여주는 화면.
// 하루의 글쓰기는 그 날로 마무리된다는 의미에서 수정은 지원하지 않는다.
export function EntryView({ entry, onBack }: Props) {

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        돌아가기
      </button>

      <div className="mb-6 rounded-xl bg-paper-cream/60 px-5 py-4">
        <p className="text-xs tracking-[0.2em] text-accent-indigo">
          {formatShortKoreanDate(entry.date)} · {entry.category} · 오늘의 글감
        </p>
        <p className="mt-1 text-base text-ink">{displayTitle(entry)}</p>
      </div>

      <div className="flex-1 rounded-2xl border border-paper-line bg-paper p-6 shadow-paper sm:p-8">
        <div
          className="prose-paper text-lg leading-[2.1] text-ink"
          dangerouslySetInnerHTML={{ __html: renderPreview(entry.content) }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-ink-soft">
        <span>{entry.charCount.toLocaleString()}자</span>
        {entry.completed && (
          <span className="flex items-center gap-1.5 text-accent-green">
            <CheckCircle2 size={15} strokeWidth={1.75} />
            그날의 글쓰기 완료
          </span>
        )}
      </div>

      {entry.feedback && entry.feedback.length > 0 && <FeedbackPanel items={entry.feedback} />}
    </div>
  )
}
