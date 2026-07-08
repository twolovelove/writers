import { describe, expect, it } from 'vitest'
import { buildTextExport } from './exportEntry'
import type { DraftEntry } from '../types'

function makeEntry(overrides: Partial<DraftEntry> = {}): DraftEntry {
  return {
    date: '2026-07-06',
    category: '에세이',
    promptId: 'essay-1',
    title: '나의 하루',
    content: '**오늘**은 *맑았다*.\n\n> 그래서 좋았다.',
    charCount: 12,
    completed: true,
    updatedAt: '2026-07-06T09:00:00.000Z',
    ...overrides,
  }
}

describe('buildTextExport', () => {
  it('txt는 서식 기호를 지우고 제목/날짜를 붙인 파일명을 만든다', () => {
    const result = buildTextExport(makeEntry(), 'txt')
    expect(result.filename).toBe('2026-07-06-나의 하루.txt')
    expect(result.mimeType).toBe('text/plain')
    expect(result.content).toBe('나의 하루\n2026년 7월 6일\n\n오늘은 맑았다.\n\n그래서 좋았다.\n')
  })

  it('md는 서식 기호를 그대로 두고 제목을 헤딩으로 만든다', () => {
    const result = buildTextExport(makeEntry(), 'md')
    expect(result.filename).toBe('2026-07-06-나의 하루.md')
    expect(result.mimeType).toBe('text/markdown')
    expect(result.content).toBe(
      '# 나의 하루\n\n*2026년 7월 6일*\n\n**오늘**은 *맑았다*.\n\n> 그래서 좋았다.\n',
    )
  })

  it('제목이 비어 있으면 글감 제목으로 대체하고 파일명 특수문자를 정리한다', () => {
    const result = buildTextExport(makeEntry({ title: '', promptId: 'no-such-prompt' }), 'txt')
    expect(result.filename).toBe('2026-07-06-글감 정보 없음.txt')
  })
})
