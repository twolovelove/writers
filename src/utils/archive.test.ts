import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { displayTitle, getStreak } from './archive'
import type { DraftEntry } from '../types'

function makeEntry(overrides: Partial<DraftEntry> = {}): DraftEntry {
  return {
    date: '2026-07-06',
    category: '에세이',
    promptId: 'essay-1',
    title: '',
    content: '오늘 쓴 글',
    charCount: 5,
    completed: false,
    updatedAt: '2026-07-06T09:00:00.000Z',
    ...overrides,
  }
}

describe('displayTitle', () => {
  it('사용자가 직접 붙인 제목이 있으면 그걸 우선한다', () => {
    expect(displayTitle(makeEntry({ title: '  나의 하루  ' }))).toBe('나의 하루')
  })

  it('제목이 없으면 글감 제목으로 대체한다', () => {
    expect(displayTitle(makeEntry({ title: '', promptId: 'essay-1' }))).toBe(
      '오늘 아침, 가장 먼저 떠오른 생각',
    )
  })

  it('글감도 못 찾으면 안내 문구를 보여준다', () => {
    expect(displayTitle(makeEntry({ title: '', promptId: 'no-such-prompt' }))).toBe('글감 정보 없음')
  })
})

describe('getStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-06T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('완료한 글이 없으면 0이다', () => {
    expect(getStreak([])).toBe(0)
  })

  it('오늘까지 연속으로 완료했으면 오늘까지 센다', () => {
    const entries = ['2026-07-04', '2026-07-05', '2026-07-06'].map((date) =>
      makeEntry({ date, completed: true }),
    )
    expect(getStreak(entries)).toBe(3)
  })

  it('오늘 아직 완료 전이어도 어제까지 이어졌으면 스트릭을 끊지 않는다', () => {
    const entries = ['2026-07-04', '2026-07-05'].map((date) => makeEntry({ date, completed: true }))
    expect(getStreak(entries)).toBe(2)
  })

  it('중간에 하루라도 비면 거기서 끊는다', () => {
    const entries = ['2026-07-01', '2026-07-05', '2026-07-06'].map((date) =>
      makeEntry({ date, completed: true }),
    )
    expect(getStreak(entries)).toBe(2)
  })
})
