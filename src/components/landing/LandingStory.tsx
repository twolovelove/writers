// 공감 스토리 섹션. 일기장/블로그가 며칠 못 가고 멈췄던 흔한 경험을 짧게 짚고,
// "오늘의 글감 자동 추천"이라는 핵심 차별점으로 자연스럽게 연결한다.
export function LandingStory() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-14">
      <p className="text-xs tracking-[0.3em] text-accent-indigo">WHY</p>
      <h2 className="mt-3 text-xl text-ink sm:text-2xl">
        일기장도, 블로그도 며칠 못 갔던 이유
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        퇴근하고 노트북을 열어도, 정작 뭘 써야 할지부터 막막해서 그냥 덮어버린 적 있으신가요.
        꾸준히 쓰겠다는 다짐은 매번 "오늘은 뭘 쓰지"라는 첫 질문 앞에서 지쳐버립니다.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        그래서 오늘의 글감은 저희가 대신 고릅니다. 매일 하나씩, 쓰고 싶은 결에 따라 에세이가
        되기도 하고 짧은 이야기가 되기도 해요. 고민 없이 바로 쓰기 시작하면 됩니다.
      </p>
    </section>
  )
}
