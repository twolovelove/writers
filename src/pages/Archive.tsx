import { useState } from 'react'
import { ArrowLeft, BookMarked, CheckCircle2, NotebookText, X } from 'lucide-react'
import { getAllDrafts } from '../utils/archive'
import { stripFormatting } from '../utils/textFormat'
import { formatShortKoreanDate } from '../utils/date'
import { PROMPTS } from '../data/prompts'
import { ArchiveCalendar } from '../components/ArchiveCalendar'
import type { DraftEntry } from '../types'

interface Props {
  onBack: () => void
  onOpenEntry: (entry: DraftEntry) => void
  onOpenCompilation: () => void
}

function snippetOf(content: string): string {
  const plain = stripFormatting(content).replace(/\s+/g, ' ').trim()
  return plain.length > 70 ? `${plain.slice(0, 70)}…` : plain
}

// Page: 지금까지 쓴 모든 글을 달력과 목록으로 모아보는 아카이브
export function Archive({ onBack, onOpenEntry, onOpenCompilation }: Props) {
  const drafts = getAllDrafts()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const visibleDrafts = selectedDate ? drafts.filter((d) => d.date === selectedDate) : drafts

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          대시보드로
        </button>

        {drafts.length > 0 && (
          <button
            type="button"
            onClick={onOpenCompilation}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <BookMarked size={14} strokeWidth={1.75} />
            모음집으로 보기
          </button>
        )}
      </div>

      <h1 className="mb-1 text-2xl text-ink sm:text-3xl">내가 쓴 글</h1>
      <p className="mb-8 text-sm text-ink-soft">지금까지 쌓아온 글이 모여 있어요. 눌러서 다시 읽어보세요.</p>

      {drafts.length > 0 && (
        <ArchiveCalendar entries={drafts} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}

      {selectedDate && (
        <button
          type="button"
          onClick={() => setSelectedDate(null)}
          className="mb-4 flex w-fit items-center gap-1.5 text-xs text-ink-soft transition-colors hover:text-ink"
        >
          <X size={13} strokeWidth={1.75} />
          {formatShortKoreanDate(selectedDate)} 필터 해제하고 전체 보기
        </button>
      )}

      {drafts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line py-16 text-center text-sm text-ink-soft">
          <NotebookText size={28} strokeWidth={1.5} className="mx-auto mb-3 text-ink-soft/60" />
          아직 쓴 글이 없어요. 오늘 첫 글을 남겨보세요.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visibleDrafts.map((entry) => {
            const promptTitle = PROMPTS.find((p) => p.id === entry.promptId)?.title ?? '글감 정보 없음'
            return (
              <li key={`${entry.date}-${entry.category}`}>
                <button
                  type="button"
                  onClick={() => onOpenEntry(entry)}
                  className="w-full rounded-xl border border-paper-line bg-paper-cream/50 p-5 text-left transition-colors duration-150 hover:bg-paper-cream"
                >
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span className="tracking-wide">
                      {formatShortKoreanDate(entry.date)} · {entry.category}
                    </span>
                    {entry.completed && (
                      <span className="flex items-center gap-1 text-accent-green">
                        <CheckCircle2 size={13} strokeWidth={1.75} />
                        완료
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-base text-ink">{promptTitle}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{snippetOf(entry.content)}</p>
                  <p className="mt-2 text-xs text-ink-soft/70">{entry.charCount.toLocaleString()}자</p>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
