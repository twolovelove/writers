import { stripFormatting } from './textFormat'
import type { FeedbackItem } from '../types'

export type { FeedbackItem }

const CONNECTIVES = ['그리고', '그래서', '하지만', '그런데', '또한', '그러나']
const FILLER_WORDS = ['정말', '진짜', '너무', '완전', '약간', '그냥']
const CLOSING_CHARS = ['.', '!', '?', '"', "'", '」', '』', '~']

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// 문장의 첫 어절만 뽑아낸다 (예: "나는 오늘 걸었다" → "나는")
function firstWord(sentence: string): string {
  return sentence.split(/\s+/)[0] ?? ''
}

// 규칙 기반(mock) 첨삭: 평균 문장 길이 / 접속사 반복 / 강조어 남용 / 문장 시작 반복 /
// 문단 구성 / 마무리 문장 / 서식 활용을 훑어보고 칭찬(praise)과 제안(suggestion),
// 마지막에 종합 총평까지 함께 돌려준다.
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

  let mostRepeatedFiller: { word: string; count: number } | null = null
  for (const word of FILLER_WORDS) {
    const count = plain.split(word).length - 1
    if (count >= 4 && (!mostRepeatedFiller || count > mostRepeatedFiller.count)) {
      mostRepeatedFiller = { word, count }
    }
  }
  if (mostRepeatedFiller) {
    feedback.push({
      type: 'suggestion',
      message: `'${mostRepeatedFiller.word}'를 ${mostRepeatedFiller.count}번 썼어요. 습관적인 강조어를 줄이면 문장이 더 담백해져요.`,
    })
  }

  if (sentences.length >= 4) {
    let streakWord = ''
    let streakLen = 0
    let maxStreak: { word: string; len: number } | null = null
    for (const sentence of sentences) {
      const word = firstWord(sentence)
      if (word && word === streakWord) {
        streakLen += 1
      } else {
        streakWord = word
        streakLen = 1
      }
      if (streakLen >= 3 && (!maxStreak || streakLen > maxStreak.len)) {
        maxStreak = { word: streakWord, len: streakLen }
      }
    }
    if (maxStreak) {
      feedback.push({
        type: 'suggestion',
        message: `문장을 연달아 '${maxStreak.word}'(으)로 시작했어요. 시작 표현을 바꿔보면 글에 리듬이 살아나요.`,
      })
    } else {
      feedback.push({ type: 'praise', message: '문장을 시작하는 표현이 다양해서 글이 단조롭지 않아요.' })
    }
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

  const praiseCount = feedback.filter((f) => f.type === 'praise').length
  const suggestionCount = feedback.length - praiseCount
  feedback.push({
    type: suggestionCount === 0 ? 'praise' : 'suggestion',
    message:
      suggestionCount === 0
        ? '오늘 글은 다듬을 곳 없이 고르게 잘 쓰였어요. 이 감각을 계속 이어가 보세요.'
        : `오늘 글에서 잘한 점 ${praiseCount}가지, 다듬으면 좋을 점 ${suggestionCount}가지를 찾았어요.`,
  })

  return feedback
}
