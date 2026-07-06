import { PenLine } from 'lucide-react'
import type { WritingPrompt } from '../types'

interface Props {
  prompt: WritingPrompt
  onStart: () => void
}

// 오늘의 글감을 보여주는 아날로그 카드. 만년필로 쓴 메모지를 연상하도록 여백과
// 은은한 그림자, serif 타이포그래피를 중심으로 구성했다.
export function PromptCard({ prompt, onStart }: Props) {
  return (
    <div className="animate-fade-in rounded-2xl border border-paper-line bg-paper-cream/60 p-8 shadow-paper sm:p-10">
      <div className="flex items-center gap-2 text-accent-indigo">
        <PenLine size={16} strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-[0.2em]">오늘의 글감 · {prompt.category}</span>
      </div>

      <h2 className="mt-5 text-2xl leading-snug text-ink sm:text-3xl">{prompt.title}</h2>

      <p className="mt-4 text-base leading-relaxed text-ink-soft">{prompt.description}</p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 rounded-full bg-ink px-7 py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
      >
        이 글감으로 쓰기 시작하기
      </button>
    </div>
  )
}
