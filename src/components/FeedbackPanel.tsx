import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import type { FeedbackItem } from '../utils/feedback'

interface Props {
  items: FeedbackItem[]
  onBackToDashboard?: () => void
}

// 완료 버튼을 누르면 나타나는 첨삭 노트. 종이 노트에 붙인 포스트잇처럼
// 은은한 인디고 테두리와 여백으로 차분하게 피드백을 전달한다.
export function FeedbackPanel({ items, onBackToDashboard }: Props) {
  return (
    <div className="animate-fade-in mt-6 rounded-2xl border border-paper-line bg-paper-cream/70 p-7 shadow-paper sm:p-8">
      <div className="flex items-center gap-2 text-accent-indigo">
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-[0.2em]">오늘의 첨삭 노트</span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
            {item.type === 'praise' ? (
              <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-green" />
            ) : (
              <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-indigo" />
            )}
            <span>{item.message}</span>
          </li>
        ))}
      </ul>

      {onBackToDashboard && (
        <button
          type="button"
          onClick={onBackToDashboard}
          className="mt-7 w-full rounded-full bg-ink py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
        >
          내일 또 쓰러 오기
        </button>
      )}
    </div>
  )
}
