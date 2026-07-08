import { PenLine, CheckCircle2, Sparkles } from 'lucide-react'

const STEPS = [
  {
    icon: PenLine,
    title: '오늘의 글감이 자동으로 도착',
    body: '카테고리도 매일 자동으로 바뀌어요. 고를 필요 없이, 오늘은 이거다 하고 바로 쓰면 됩니다.',
  },
  {
    icon: CheckCircle2,
    title: '1,000자만 채우면 끝',
    body: '부담 없는 분량이에요. 다 쓰고 완료 버튼을 누르면 오늘의 글쓰기가 마무리돼요.',
  },
  {
    icon: Sparkles,
    title: '첨삭 노트 + 연속 기록',
    body: '완료하자마자 잘한 점과 다듬으면 좋을 점을 짧게 받아보고, 연속 작성일도 함께 쌓여요.',
  },
]

// 이용 흐름을 3단계 카드로 보여줘 "가입 후 뭘 하게 되는지"를 한눈에 이해시킨다.
export function LandingSteps() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs tracking-[0.3em] text-accent-indigo">HOW IT WORKS</p>
      <h2 className="mt-3 text-xl text-ink sm:text-2xl">이렇게 씁니다</h2>

      <ol className="mt-8 flex flex-col gap-5">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex items-start gap-4 rounded-2xl border border-paper-line bg-paper-cream/60 p-6 shadow-card"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-accent-indigo">
              <step.icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs tracking-wide text-accent-indigo">STEP {i + 1}</p>
              <h3 className="mt-1 text-base text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
