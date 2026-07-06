import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import type { FeedbackItem } from '../utils/feedback'

interface Props {
  items: FeedbackItem[]
  onBackToDashboard?: () => void
}

// 완료 버튼을 누르면 나타나는 첨삭 노트. 종이 노트에 붙인 포스트잇처럼
// 은은한 인디고 테두리와 여백으로 차분하게 피드백을 전달한다.
// 마지막 항목은 항상 종합 총평이라 (generateFeedback 참고) 그룹에서 제외하고 하단에 따로 보여준다.
export function FeedbackPanel({ items, onBackToDashboard }: Props) {
  const summary = items[items.length - 1]
  const rest = items.slice(0, -1)
  const praises = rest.filter((item) => item.type === 'praise')
  const suggestions = rest.filter((item) => item.type === 'suggestion')

  return (
    <div className="animate-fade-in mt-6 rounded-2xl border border-paper-line bg-paper-cream/70 p-7 shadow-paper sm:p-8">
      <div className="flex items-center gap-2 text-accent-indigo">
        <Sparkles size={16} strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-[0.2em]">오늘의 첨삭 노트</span>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {praises.length > 0 && (
          <div>
            <p className="text-xs font-medium tracking-wide text-accent-green">잘한 점 {praises.length}가지</p>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {praises.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-green" />
                  <span>{item.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <p className="text-xs font-medium tracking-wide text-accent-indigo">다듬으면 좋을 점 {suggestions.length}가지</p>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {suggestions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-indigo" />
                  <span>{item.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {summary && (
        <p className="mt-5 border-t border-paper-line pt-4 text-sm leading-relaxed text-ink-soft">
          {summary.message}
        </p>
      )}

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
