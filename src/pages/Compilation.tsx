import { ArrowLeft, Printer } from 'lucide-react'
import { renderPreview } from '../utils/textFormat'
import { formatShortKoreanDate } from '../utils/date'
import { PROMPTS } from '../data/prompts'
import type { DraftEntry } from '../types'

interface Props {
  entries: DraftEntry[]
  onBack: () => void
}

// Page: 지금까지 쓴 글을 책처럼 엮어 보여주는 모음집. 인쇄하거나 PDF로 저장해
// 이메일로 보내는 등 원하는 방식으로 간직할 수 있다 (자동 발송은 지원하지 않음).
export function Compilation({ entries, onBack }: Props) {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const totalChars = sorted.reduce((sum, e) => sum + e.charCount, 0)

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          돌아가기
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs tracking-wide text-paper transition-colors hover:bg-accent-indigo"
        >
          <Printer size={14} strokeWidth={1.75} />
          인쇄 · PDF로 저장
        </button>
      </div>

      {/* 표지 */}
      <section className="mb-16 flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.3em] text-accent-indigo">MY WRITING COLLECTION</p>
        <h1 className="mt-4 text-3xl text-ink sm:text-4xl">나의 글쓰기 모음집</h1>
        {first && last && (
          <p className="mt-4 text-sm text-ink-soft">
            {formatShortKoreanDate(first.date)} — {formatShortKoreanDate(last.date)}
          </p>
        )}
        <p className="mt-1 text-sm text-ink-soft">
          총 {sorted.length}편 · {totalChars.toLocaleString()}자
        </p>
      </section>

      {/* 본문 */}
      {sorted.map((entry, i) => {
        const promptTitle = PROMPTS.find((p) => p.id === entry.promptId)?.title ?? '글감 정보 없음'
        return (
          <section
            key={`${entry.date}-${entry.category}`}
            className={[
              'mb-14 border-t border-paper-line pt-10',
              i > 0 ? 'break-before-page' : '',
            ].join(' ')}
          >
            <p className="text-xs tracking-[0.2em] text-accent-indigo">
              {formatShortKoreanDate(entry.date)} · {entry.category}
            </p>
            <h2 className="mt-2 text-xl text-ink">{promptTitle}</h2>
            <div
              className="prose-paper mt-5 text-base leading-[2.1] text-ink"
              dangerouslySetInnerHTML={{ __html: renderPreview(entry.content) }}
            />
          </section>
        )
      })}
    </div>
  )
}
