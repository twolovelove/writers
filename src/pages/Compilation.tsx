import { useMemo, useState } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { renderPreview } from '../utils/textFormat'
import { formatShortKoreanDate, formatKoreanYearMonth } from '../utils/date'
import { displayTitle } from '../utils/archive'
import type { DraftEntry } from '../types'

interface Props {
  entries: DraftEntry[]
  onBack: () => void
}

const TITLE_KEY = 'writer:compilationTitle'
const DEFAULT_TITLE = '나의 글쓰기 모음집'
const ALL_MONTHS = 'all'

// Page: 지금까지 쓴 글을 책처럼 엮어 보여주는 모음집. 인쇄하거나 PDF로 저장해
// 이메일로 보내는 등 원하는 방식으로 간직할 수 있다 (자동 발송은 지원하지 않음).
export function Compilation({ entries, onBack }: Props) {
  const [title, setTitle] = useState(() => localStorage.getItem(TITLE_KEY) ?? DEFAULT_TITLE)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (value.trim()) {
      localStorage.setItem(TITLE_KEY, value)
    } else {
      localStorage.removeItem(TITLE_KEY)
    }
  }

  const sorted = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [entries],
  )

  const months = useMemo(() => {
    const set = new Set(sorted.map((e) => e.date.slice(0, 7)))
    return [...set].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
  }, [sorted])

  const [selectedMonth, setSelectedMonth] = useState<string>(() => months[0] ?? ALL_MONTHS)

  const filtered = useMemo(
    () =>
      selectedMonth === ALL_MONTHS
        ? sorted
        : sorted.filter((e) => e.date.slice(0, 7) === selectedMonth),
    [sorted, selectedMonth],
  )

  const first = filtered[0]
  const last = filtered[filtered.length - 1]
  const totalChars = filtered.reduce((sum, e) => sum + e.charCount, 0)

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6 py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          돌아가기
        </button>
        <div className="flex items-center gap-2">
          {months.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-full border border-paper-line bg-transparent px-3 py-2 text-xs text-ink-soft transition-colors hover:text-ink focus:outline-none"
            >
              <option value={ALL_MONTHS}>전체 기간</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatKoreanYearMonth(m)}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs tracking-wide text-paper transition-colors hover:bg-accent-indigo"
          >
            <Printer size={14} strokeWidth={1.75} />
            인쇄 · PDF로 저장
          </button>
        </div>
      </div>

      {/* 표지 */}
      <section className="mb-16 flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.3em] text-accent-indigo">MY WRITING COLLECTION</p>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={() => {
            if (!title.trim()) handleTitleChange(DEFAULT_TITLE)
          }}
          placeholder={DEFAULT_TITLE}
          aria-label="모음집 제목"
          className="mt-4 w-full bg-transparent text-center text-3xl text-ink focus:outline-none focus:ring-1 focus:ring-accent-indigo/40 sm:text-4xl print:ring-0"
        />
        {selectedMonth !== ALL_MONTHS && (
          <p className="mt-3 text-sm text-accent-indigo">{formatKoreanYearMonth(selectedMonth)}</p>
        )}
        {first && last && (
          <p className="mt-4 text-sm text-ink-soft">
            {formatShortKoreanDate(first.date)} — {formatShortKoreanDate(last.date)}
          </p>
        )}
        <p className="mt-1 text-sm text-ink-soft">
          총 {filtered.length}편 · {totalChars.toLocaleString()}자
        </p>
      </section>

      {/* 목차 */}
      {filtered.length > 0 && (
        <section className="mb-16 break-after-page">
          <h2 className="mb-6 text-xs tracking-[0.3em] text-accent-indigo">목차</h2>
          <ol className="space-y-3">
            {filtered.map((entry, i) => (
              <li key={`toc-${entry.date}-${entry.category}`}>
                <a
                  href={`#entry-${i}`}
                  className="flex items-baseline justify-between gap-4 text-sm text-ink transition-colors hover:text-accent-indigo"
                >
                  <span className="truncate">
                    <span className="text-ink-soft">{formatShortKoreanDate(entry.date)}</span>{' '}
                    {displayTitle(entry)}
                  </span>
                  <span className="shrink-0 text-xs text-ink-soft">{entry.category}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 본문 */}
      {filtered.map((entry, i) => {
        return (
          <section
            key={`${entry.date}-${entry.category}`}
            id={`entry-${i}`}
            className={[
              'mb-14 border-t border-paper-line pt-10',
              i > 0 ? 'break-before-page' : '',
            ].join(' ')}
          >
            <p className="text-xs tracking-[0.2em] text-accent-indigo">
              {formatShortKoreanDate(entry.date)} · {entry.category}
            </p>
            <h2 className="mt-2 text-xl text-ink">{displayTitle(entry)}</h2>
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
