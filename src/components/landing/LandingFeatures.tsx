import { Shuffle, Sparkles, BookOpen, RefreshCw } from 'lucide-react'
import { CATEGORIES } from '../../data/prompts'

const FEATURES = [
  {
    icon: Shuffle,
    title: '자동 추천 글감',
    body: `${CATEGORIES.join(' · ')} 중 오늘의 결에 맞는 글감 하나가 자동으로 정해져요. 고르는 데 시간을 쓰지 않아도 돼요.`,
  },
  {
    icon: Sparkles,
    title: '첨삭 노트',
    body: '잘한 점, 다듬으면 좋을 점, 총평까지. 부담스럽지 않은 톤으로 짧게 격려해 드려요.',
  },
  {
    icon: BookOpen,
    title: '아카이브 & 모음집',
    body: '쓴 글이 쌓여 표지와 목차가 있는 나만의 책이 돼요. 인쇄하거나 PDF로 저장할 수 있어요.',
  },
  {
    icon: RefreshCw,
    title: '기기 간 동기화',
    body: 'Google 로그인 한 번이면 웹에서 쓰던 글을 모바일에서 그대로 이어서 쓸 수 있어요.',
  },
]

// 핵심 기능을 2x2 카드로 요약해 "가입하면 구체적으로 뭘 얻는지"를 보여준다.
export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs tracking-[0.3em] text-accent-indigo">FEATURES</p>
      <h2 className="mt-3 text-xl text-ink sm:text-2xl">쓰는 동안 함께하는 것들</h2>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-paper-line bg-paper-cream/60 p-6 shadow-card"
          >
            <feature.icon size={18} strokeWidth={1.75} className="text-accent-indigo" />
            <h3 className="mt-3 text-base text-ink">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
