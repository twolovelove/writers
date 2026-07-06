export type FormatType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'quote'

interface Selection {
  value: string
  selectionStart: number
  selectionEnd: number
}

interface FormatResult {
  value: string
  selectionStart: number
  selectionEnd: number
}

const INLINE_MARKERS: Record<'bold' | 'italic' | 'underline' | 'strikethrough', [string, string]> = {
  bold: ['**', '**'],
  italic: ['*', '*'],
  underline: ['<u>', '</u>'],
  strikethrough: ['~~', '~~'],
}

// 선택한 영역을 서식 기호로 감싼다. 선택 영역이 없으면 커서 위치에 기호 쌍을 삽입하고
// 그 사이에 커서를 둔다 (벨로그 에디터의 굵게/기울임/밑줄/취소선 동작과 동일)
function wrapInline(
  { value, selectionStart, selectionEnd }: Selection,
  [before, after]: [string, string],
): FormatResult {
  const selected = value.slice(selectionStart, selectionEnd)
  const already = value.slice(selectionStart - before.length, selectionStart) === before
    && value.slice(selectionEnd, selectionEnd + after.length) === after

  if (already) {
    // 이미 같은 서식이 적용돼 있으면 토글 해제
    const newValue =
      value.slice(0, selectionStart - before.length) +
      selected +
      value.slice(selectionEnd + after.length)
    return {
      value: newValue,
      selectionStart: selectionStart - before.length,
      selectionEnd: selectionEnd - before.length,
    }
  }

  const newValue = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd)
  return {
    value: newValue,
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionStart + before.length + selected.length,
  }
}

// 인용구는 선택된 각 줄 앞에 "> "를 붙이거나(토글 시 제거) 처리한다
function toggleQuote({ value, selectionStart, selectionEnd }: Selection): FormatResult {
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lineEndIndex = value.indexOf('\n', selectionEnd)
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex

  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')
  const allQuoted = lines.every((line) => line.startsWith('> '))

  const newLines = allQuoted ? lines.map((line) => line.slice(2)) : lines.map((line) => `> ${line}`)
  const newBlock = newLines.join('\n')
  const delta = newBlock.length - block.length

  const newValue = value.slice(0, lineStart) + newBlock + value.slice(lineEnd)
  return {
    value: newValue,
    selectionStart: lineStart,
    selectionEnd: lineEnd + delta,
  }
}

export function applyFormat(selection: Selection, type: FormatType): FormatResult {
  if (type === 'quote') return toggleQuote(selection)
  return wrapInline(selection, INLINE_MARKERS[type])
}

// 첨삭 분석 등에서 순수 텍스트만 볼 때 쓰는, 서식 기호를 제거한 버전을 반환
export function stripFormatting(markdown: string): string {
  return markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<u>([^<]+)<\/u>/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^>\s?/gm, '')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 굵게/기울임/밑줄/취소선/인용구, 5가지 서식만 지원하는 최소한의 마크다운 프리뷰 렌더러
export function renderPreview(markdown: string): string {
  const escaped = escapeHtml(markdown)

  const withInline = escaped
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/&lt;u&gt;([^&]+)&lt;\/u&gt;/g, '<u>$1</u>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  const lines = withInline.split('\n')
  const html: string[] = []
  let quoteBuffer: string[] = []

  const flushQuote = () => {
    if (quoteBuffer.length > 0) {
      html.push(`<blockquote>${quoteBuffer.join('<br/>')}</blockquote>`)
      quoteBuffer = []
    }
  }

  for (const line of lines) {
    if (line.startsWith('&gt; ')) {
      quoteBuffer.push(line.slice(5))
    } else {
      flushQuote()
      html.push(line.length > 0 ? `<p>${line}</p>` : '<br/>')
    }
  }
  flushQuote()

  return html.join('')
}
