import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyNewerRemoteEntry, displayTitle, getAllDrafts, getStreak } from './archive'
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

function putDraft(entry: DraftEntry) {
  localStorage.setItem(`writer:draft:${entry.date}:${entry.category}`, JSON.stringify(entry))
}

beforeEach(() => {
  localStorage.clear()
})

describe('getAllDrafts', () => {
  it('draft 키가 아닌 항목은 무시한다', () => {
    localStorage.setItem('writer:lastCategory', '에세이')
    putDraft(makeEntry())

    expect(getAllDrafts()).toHaveLength(1)
  })

  it('내용이 비어있는 초고는 제외한다', () => {
    putDraft(makeEntry({ content: '   ' }))
    putDraft(makeEntry({ date: '2026-07-05', content: '실제 글' }))

    const drafts = getAllDrafts()
    expect(drafts).toHaveLength(1)
    expect(drafts[0].date).toBe('2026-07-05')
  })

  it('최신 날짜 먼저, 같은 날짜면 카테고리 오름차순으로 정렬한다', () => {
    putDraft(makeEntry({ date: '2026-07-04', category: '비평' }))
    putDraft(makeEntry({ date: '2026-07-06', category: '자유주제' }))
    putDraft(makeEntry({ date: '2026-07-06', category: '에세이' }))

    const drafts = getAllDrafts()
    expect(drafts.map((d) => `${d.date}:${d.category}`)).toEqual([
      '2026-07-06:에세이',
      '2026-07-06:자유주제',
      '2026-07-04:비평',
    ])
  })
})

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

describe('applyNewerRemoteEntry', () => {
  it('로컬에 없으면 그대로 저장한다', () => {
    const remote = makeEntry({ updatedAt: '2026-07-06T10:00:00.000Z' })
    applyNewerRemoteEntry(remote, null)

    expect(getAllDrafts()).toHaveLength(1)
  })

  it('원격이 더 최신이면 로컬을 덮어쓴다', () => {
    const local = makeEntry({ content: '옛날 내용', updatedAt: '2026-07-06T09:00:00.000Z' })
    const remote = makeEntry({ content: '새 내용', updatedAt: '2026-07-06T10:00:00.000Z' })

    applyNewerRemoteEntry(remote, local)

    expect(getAllDrafts()[0].content).toBe('새 내용')
  })

  it('로컬이 같거나 더 최신이면 덮어쓰지 않는다', () => {
    const local = makeEntry({ content: '최신 내용', updatedAt: '2026-07-06T10:00:00.000Z' })
    const remote = makeEntry({ content: '오래된 내용', updatedAt: '2026-07-06T09:00:00.000Z' })
    putDraft(local)

    applyNewerRemoteEntry(remote, local)

    expect(getAllDrafts()[0].content).toBe('최신 내용')
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
