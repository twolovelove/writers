import { Bold, Italic, Underline, Strikethrough, Quote, Eye, PenLine } from 'lucide-react'
import type { FormatType } from '../utils/textFormat'

interface Props {
  onFormat: (type: FormatType) => void
  isPreview: boolean
  onTogglePreview: () => void
}

const TOOLS: { type: FormatType; icon: typeof Bold; label: string; shortcut: string }[] = [
  { type: 'bold', icon: Bold, label: '굵게', shortcut: '⌘B' },
  { type: 'italic', icon: Italic, label: '기울임', shortcut: '⌘I' },
  { type: 'underline', icon: Underline, label: '밑줄', shortcut: '⌘U' },
  { type: 'strikethrough', icon: Strikethrough, label: '취소선', shortcut: '⌘⇧S' },
  { type: 'quote', icon: Quote, label: '인용구', shortcut: '⌘⇧Q' },
]

// 벨로그(Velog) 스타일의 서식 도구 모음. 버튼 클릭 또는 단축키로 선택 영역에
// 서식을 적용하고, 우측 버튼으로 마크다운 미리보기를 전환할 수 있다.
export function EditorToolbar({ onFormat, isPreview, onTogglePreview }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-paper-line px-2 pb-3">
      <div className="flex items-center gap-1">
        {TOOLS.map(({ type, icon: Icon, label, shortcut }) => (
          <button
            key={type}
            type="button"
            title={`${label} (${shortcut})`}
            disabled={isPreview}
            onClick={() => onFormat(type)}
            className="rounded-lg p-2 text-ink-soft transition-colors duration-150 hover:bg-paper-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon size={17} strokeWidth={1.75} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onTogglePreview}
        className={[
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs tracking-wide transition-colors duration-150',
          isPreview ? 'bg-accent-indigo text-paper' : 'text-ink-soft hover:bg-paper-cream hover:text-ink',
        ].join(' ')}
      >
        {isPreview ? <PenLine size={14} strokeWidth={1.75} /> : <Eye size={14} strokeWidth={1.75} />}
        {isPreview ? '계속 쓰기' : '미리보기'}
      </button>
    </div>
  )
}
