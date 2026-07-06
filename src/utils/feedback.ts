import { stripFormatting } from './textFormat'

export interface FeedbackItem {
  type: 'praise' | 'suggestion'
  message: string
}

const CONNECTIVES = ['그리고', '그래서', '하지만', '그런데', '또한', '그러나']
const CLOSING_CHARS = ['.', '!', '?', '"', "'", '」', '』', '~']

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// 규칙 기반(mock) 첨삭: 평균 문장 길이 / 접속사 반복 / 문단 구성 / 마무리 문장 / 서식 활용,
// 다섯 가지 관점에서 글을 훑어보고 칭찬(praise)과 제안(suggestion)을 함께 돌려준다.
export function generateFeedback(raw: string): FeedbackItem[] {
  const plain = stripFormatting(raw).trim()
  const charCount = raw.length
  const sentences = splitSentences(plain)
  const feedback: FeedbackItem[] = []

  feedback.push({
    type: 'praise',
    message: `총 ${charCount.toLocaleString()}자, 문장 ${sentences.length}개로 오늘의 글을 완성했어요.`,
  })

  if (sentences.length > 0) {
    const avgLen = Math.round(plain.replace(/\s/g, '').length / sentences.length)
    if (avgLen > 70) {
      feedback.push({
        type: 'suggestion',
        message: `문장이 다소 긴 편이에요 (평균 약 ${avgLen}자). 한 문장에 하나의 생각만 담아 나눠보면 더 잘 읽혀요.`,
      })
    } else {
      feedback.push({
        type: 'praise',
        message: `문장 길이가 적절해서 리듬감 있게 읽혀요 (평균 약 ${avgLen}자).`,
      })
    }
  }

  let mostRepeated: { word: string; count: number } | null = null
  for (const word of CONNECTIVES) {
    const count = plain.split(word).length - 1
    if (count >= 4 && (!mostRepeated || count > mostRepeated.count)) {
      mostRepeated = { word, count }
    }
  }
  if (mostRepeated) {
    feedback.push({
      type: 'suggestion',
      message: `'${mostRepeated.word}'가 ${mostRepeated.count}번 반복돼요. 다른 연결 표현으로 바꾸거나 문장을 재구성해보세요.`,
    })
  } else {
    feedback.push({ type: 'praise', message: '접속사를 반복하지 않고 다양하게 사용했어요.' })
  }

  const paragraphs = raw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (charCount > 300 && paragraphs.length <= 1) {
    feedback.push({
      type: 'suggestion',
      message: '글이 한 문단으로 길게 이어져 있어요. 내용이 바뀌는 지점에서 문단을 나누면 훨씬 읽기 편해져요.',
    })
  } else {
    feedback.push({ type: 'praise', message: '문단이 적절히 나뉘어 있어 가독성이 좋아요.' })
  }

  const lastChar = plain.slice(-1)
  if (plain.length > 0 && !CLOSING_CHARS.includes(lastChar)) {
    feedback.push({
      type: 'suggestion',
      message: '마지막 문장이 문장부호 없이 끝났어요. 마침표로 깔끔하게 매듭지어보세요.',
    })
  } else {
    feedback.push({ type: 'praise', message: '글의 마무리가 자연스럽게 매듭지어졌어요.' })
  }

  const usesFormatting = /\*\*[^*]+\*\*|~~[^~]+~~|<u>[^<]+<\/u>|^>\s?/m.test(raw)
  if (usesFormatting) {
    feedback.push({ type: 'praise', message: '서식을 활용해 글에 강약을 잘 살렸어요.' })
  } else {
    feedback.push({
      type: 'suggestion',
      message: '강조하고 싶은 문장에 굵게나 인용구 서식을 더해보면 글에 리듬이 생겨요.',
    })
  }

  return feedback
}
