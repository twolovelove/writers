import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toISODate } from '../utils/date'
import type { DraftEntry } from '../types'

interface Props {
  entries: DraftEntry[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 아카이브에서 언제 글을 썼는지 한눈에 보여주는 한 달 달력.
// 완료한 날은 초록 점, 목표 미달 초고만 있는 날은 인디고 점으로 표시한다.
export function ArchiveCalendar({ entries, selectedDate, onSelectDate }: Props) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const entriesByDate = new Map<string, DraftEntry[]>()
  for (const entry of entries) {
    const list = entriesByDate.get(entry.date) ?? []
    list.push(entry)
    entriesByDate.set(entry.date, list)
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayIso = toISODate(today)

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const changeMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1))
    onSelectDate(null)
  }

  return (
    <div className="mb-8 rounded-2xl border border-paper-line bg-paper-cream/40 p-3 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          aria-label="이전 달"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <p className="text-sm tracking-wide text-ink">
          {year}년 {month + 1}월
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          aria-label="다음 달"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-xs text-ink-soft/70">
            {w}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />

          const iso = toISODate(new Date(year, month, day))
          const dayEntries = entriesByDate.get(iso) ?? []
          const hasCompleted = dayEntries.some((e) => e.completed)
          const hasDraft = dayEntries.length > 0
          const isToday = iso === todayIso
          const isSelected = iso === selectedDate

          return (
            <button
              key={iso}
              type="button"
              disabled={!hasDraft}
              onClick={() => onSelectDate(isSelected ? null : iso)}
              className={[
                'mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full text-xs transition-colors duration-150',
                isSelected
                  ? 'bg-accent-indigo text-paper'
                  : isToday
                    ? 'border border-accent-indigo/50 text-ink'
                    : hasDraft
                      ? 'text-ink hover:bg-paper-cream'
                      : 'text-ink-soft/40',
              ].join(' ')}
            >
              <span>{day}</span>
              {hasDraft && !isSelected && (
                <span
                  className={[
                    'mt-0.5 h-1 w-1 rounded-full',
                    hasCompleted ? 'bg-accent-green' : 'bg-accent-indigo/60',
                  ].join(' ')}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
