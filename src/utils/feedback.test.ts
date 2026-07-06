import { describe, expect, it } from 'vitest'
import { generateFeedback } from './feedback'

function typeOf(items: ReturnType<typeof generateFeedback>, keyword: string) {
  return items.find((f) => f.message.includes(keyword))?.type
}

describe('generateFeedback', () => {
  it('짧고 다양한 글에는 칭찬 위주의 피드백을 준다', () => {
    const text =
      '오늘은 창밖으로 비가 내렸다. 우산 없이 걷다 흠뻑 젖었지만 기분은 오히려 상쾌했다. ' +
      '문득 어릴 적 빗속을 뛰어다니던 기억이 떠올랐다.'
    const feedback = generateFeedback(text)

    expect(feedback[0].type).toBe('praise')
    expect(feedback[0].message).toContain(`${text.length}자`)
    expect(typeOf(feedback, '접속사')).toBe('praise')
  })

  it('접속사를 4번 이상 반복하면 제안을 준다', () => {
    const text = '그리고 밥을 먹었다. 그리고 잠을 잤다. 그리고 걸었다. 그리고 글을 썼다.'
    const feedback = generateFeedback(text)

    const suggestion = feedback.find((f) => f.message.includes("'그리고'"))
    expect(suggestion?.type).toBe('suggestion')
    expect(suggestion?.message).toContain('4번')
  })

  it('강조어(필러)를 4번 이상 쓰면 제안을 준다', () => {
    const text = '오늘은 정말 좋았다. 날씨도 정말 맑았다. 기분도 정말 상쾌했다. 밥도 정말 맛있었다.'
    const feedback = generateFeedback(text)

    const suggestion = feedback.find((f) => f.message.includes("'정말'"))
    expect(suggestion?.type).toBe('suggestion')
  })

  it('같은 단어로 문장을 3번 이상 연달아 시작하면 제안을 준다', () => {
    const text = '나는 걸었다. 나는 웃었다. 나는 노래했다. 나는 집에 왔다.'
    const feedback = generateFeedback(text)

    const suggestion = feedback.find((f) => f.message.includes("'나는'"))
    expect(suggestion?.type).toBe('suggestion')
  })

  it('문장이 4개 미만이면 문장 시작 반복은 아예 채점하지 않는다', () => {
    const text = '나는 걸었다. 나는 웃었다.'
    const feedback = generateFeedback(text)

    expect(feedback.some((f) => f.message.includes('연달아'))).toBe(false)
  })

  it('300자를 넘는데 문단 구분이 없으면 제안을 준다', () => {
    const text = '가'.repeat(310) + '.'
    const feedback = generateFeedback(text)

    expect(typeOf(feedback, '한 문단으로')).toBe('suggestion')
  })

  it('빈 줄로 문단을 나누면 칭찬을 준다', () => {
    const text = `${'가'.repeat(160)}.\n\n${'나'.repeat(160)}.`
    const feedback = generateFeedback(text)

    expect(typeOf(feedback, '가독성')).toBe('praise')
  })

  it('문장부호 없이 끝나면 제안을, 있으면 칭찬을 준다', () => {
    const withoutPunctuation = generateFeedback('오늘은 그냥 산책을 했다 기분이 좋았다')
    const withPunctuation = generateFeedback('오늘은 그냥 산책을 했다. 기분이 좋았다.')

    expect(typeOf(withoutPunctuation, '마침표')).toBe('suggestion')
    expect(typeOf(withPunctuation, '매듭지어졌어요')).toBe('praise')
  })

  it('서식을 쓰면 칭찬을, 안 쓰면 제안을 준다', () => {
    const formatted = generateFeedback('오늘은 **정말** 좋은 하루였다.')
    const plain = generateFeedback('오늘은 좋은 하루였다.')

    expect(typeOf(formatted, '강약')).toBe('praise')
    expect(typeOf(plain, '인용구 서식')).toBe('suggestion')
  })

  it('마지막 총평은 칭찬/제안 개수를 정확히 센다', () => {
    const text = '나는 걸었다. 나는 웃었다. 나는 노래했다. 나는 집에 왔다.'
    const feedback = generateFeedback(text)
    const last = feedback[feedback.length - 1]

    const praiseCount = feedback.slice(0, -1).filter((f) => f.type === 'praise').length
    const suggestionCount = feedback.slice(0, -1).length - praiseCount

    expect(last.message).toContain(`잘한 점 ${praiseCount}가지`)
    expect(last.message).toContain(`다듬으면 좋을 점 ${suggestionCount}가지`)
  })
})
