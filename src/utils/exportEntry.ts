import { displayTitle } from './archive'
import { stripFormatting } from './textFormat'
import type { DraftEntry } from '../types'

export type TextExportFormat = 'txt' | 'md'

function formatFullKoreanDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return `${y}년 ${m}월 ${d}일`
}

// 파일 시스템에서 문제되는 문자만 제거한, 파일명으로 쓰기 안전한 제목
function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 50) || '글'
}

export interface TextExport {
  filename: string
  content: string
  mimeType: string
}

// txt/md 파일 내용을 만든다. 실제 다운로드(Blob/URL)는 브라우저 API라 테스트하기 어려우니
// 내용을 만드는 이 함수와 분리해 둔다
export function buildTextExport(entry: DraftEntry, format: TextExportFormat): TextExport {
  const title = displayTitle(entry)
  const dateLabel = formatFullKoreanDate(entry.date)
  const filename = `${entry.date}-${sanitizeFilename(title)}.${format}`

  if (format === 'md') {
    return {
      filename,
      mimeType: 'text/markdown',
      content: `# ${title}\n\n*${dateLabel}*\n\n${entry.content.trim()}\n`,
    }
  }

  return {
    filename,
    mimeType: 'text/plain',
    content: `${title}\n${dateLabel}\n\n${stripFormatting(entry.content).trim()}\n`,
  }
}

export function downloadTextExport(entry: DraftEntry, format: TextExportFormat): void {
  const { filename, content, mimeType } = buildTextExport(entry, format)
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const CARD_WIDTH = 1080
const CARD_HEIGHT = 1080
const CARD_PADDING = 96

const CARD_COLORS = {
  paper: '#FDFBF7',
  paperLine: '#EAE5DC',
  ink: '#2C2C2C',
  inkSoft: '#6B675F',
  accentIndigo: '#5B6B8C',
}

const SERIF_FONT = '"Noto Serif KR", "Nanum Myeongjo", serif'

// 문단(줄바꿈)은 유지하면서, 캔버스 폭에 맞게 글자 단위로 줄바꿈한다.
// 한글은 어절 내부에서 줄바꿈해도 자연스러워서 단어 단위보다 글자 단위 wrap이 더 안전하다
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    if (paragraph.trim() === '') {
      lines.push('')
      continue
    }
    let current = ''
    for (const char of paragraph) {
      const test = current + char
      if (current && ctx.measureText(test).width > maxWidth) {
        lines.push(current)
        current = char
      } else {
        current = test
      }
    }
    if (current) lines.push(current)
  }
  return lines
}

const BODY_FONT_SIZES = [46, 42, 38, 34, 30, 26, 22]

// 본문이 카드 안에 들어가도록 폰트 크기를 줄여가며 맞춰보고, 그래도 넘치면 잘라서 말줄임표를 붙인다
function fitBody(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
): { fontSize: number; lineHeight: number; lines: string[] } {
  for (const fontSize of BODY_FONT_SIZES) {
    ctx.font = `${fontSize}px ${SERIF_FONT}`
    const lineHeight = Math.round(fontSize * 1.7)
    const lines = wrapLines(ctx, text, maxWidth)
    if (lines.length * lineHeight <= maxHeight) {
      return { fontSize, lineHeight, lines }
    }
  }

  const fontSize = BODY_FONT_SIZES[BODY_FONT_SIZES.length - 1]
  ctx.font = `${fontSize}px ${SERIF_FONT}`
  const lineHeight = Math.round(fontSize * 1.7)
  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight))
  const lines = wrapLines(ctx, text, maxWidth).slice(0, maxLines)
  if (lines.length > 0) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : `${last}…`
  }
  return { fontSize, lineHeight, lines }
}

function fillTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
): void {
  let cursor = x
  for (const char of text) {
    ctx.fillText(char, cursor, y)
    cursor += ctx.measureText(char).width + spacing
  }
}

// 인스타그램 피드용 정사각형(1080x1080) 인용구 카드를 그려 PNG로 내보낸다
export async function downloadImageCard(entry: DraftEntry): Promise<void> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  await document.fonts.ready

  ctx.fillStyle = CARD_COLORS.paper
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = CARD_COLORS.accentIndigo
  ctx.font = `600 22px ${SERIF_FONT}`
  fillTrackedText(ctx, 'MY WRITING', CARD_PADDING, CARD_PADDING + 22, 5)

  const dateLabel = formatFullKoreanDate(entry.date)
  ctx.font = `28px ${SERIF_FONT}`
  ctx.fillText(dateLabel, CARD_PADDING, CARD_PADDING + 72)

  const title = displayTitle(entry)
  ctx.fillStyle = CARD_COLORS.ink
  ctx.font = `600 50px ${SERIF_FONT}`
  const titleLines = wrapLines(ctx, title, CARD_WIDTH - CARD_PADDING * 2).slice(0, 2)
  let titleY = CARD_PADDING + 148
  for (const line of titleLines) {
    ctx.fillText(line, CARD_PADDING, titleY)
    titleY += 62
  }

  const dividerY = titleY + 16
  ctx.strokeStyle = CARD_COLORS.paperLine
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(CARD_PADDING, dividerY)
  ctx.lineTo(CARD_WIDTH - CARD_PADDING, dividerY)
  ctx.stroke()

  const footerY = CARD_HEIGHT - CARD_PADDING
  const bodyTop = dividerY + 56
  const bodyMaxHeight = footerY - 40 - bodyTop

  const bodyText = stripFormatting(entry.content).trim()
  const { fontSize, lineHeight, lines } = fitBody(
    ctx,
    bodyText,
    CARD_WIDTH - CARD_PADDING * 2,
    bodyMaxHeight,
  )
  ctx.fillStyle = CARD_COLORS.ink
  ctx.font = `${fontSize}px ${SERIF_FONT}`
  let bodyY = bodyTop + fontSize
  for (const line of lines) {
    ctx.fillText(line, CARD_PADDING, bodyY)
    bodyY += lineHeight
  }

  ctx.fillStyle = CARD_COLORS.inkSoft
  ctx.font = `22px ${SERIF_FONT}`
  ctx.fillText(`${entry.charCount.toLocaleString()}자의 글`, CARD_PADDING, footerY)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${entry.date}-${sanitizeFilename(displayTitle(entry))}-card.png`
  a.click()
  URL.revokeObjectURL(url)
}
