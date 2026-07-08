import { PenLine } from 'lucide-react'

interface Props {
  onGoogleLogin: () => void
}

// 랜딩페이지 최상단. "언젠가 글 쓰는 사람이 되고 싶었다"는 욕망을 자극하는 캐치프레이즈로
// 열고, 서브카피에서 퇴근 후 직장인 타겟과 자동 추천 글감(고민 없이 바로 쓰기)을 붙인다.
// 재방문자가 스크롤 없이 바로 로그인할 수 있도록 CTA를 첫 화면에 둔다.
export function LandingHero({ onGoogleLogin }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-14 pt-20 text-center sm:pt-24">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-paper-cream text-accent-indigo">
        <PenLine size={22} strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl text-ink sm:text-3xl">작가를 꿈꾸고 계신가요?</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        퇴근하고 뭘 써야 할지 고민할 필요 없어요. 오늘의 글감 하나로 매일 1,000자씩 — 그렇게
        조금씩 진짜 작가가 되어갑니다.
      </p>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="mt-8 w-full rounded-full bg-ink py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
      >
        Google 계정으로 계속하기
      </button>
    </div>
  )
}
