import { ArrowLeft } from 'lucide-react'

interface Props {
  onBack: () => void
}

// Page: 서비스의 실제 글쓰기 동작 규칙(글감 배정, 완료 잠금, 저장 방식 등)을 설명하는 안내 페이지.
// 개인정보처리방침/이용약관과 달리 로그인 후 설정 화면에서만 진입한다.
export function WritingPolicy({ onBack }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        설정으로
      </button>

      <h1 className="mb-2 text-2xl text-ink sm:text-3xl">글쓰기 정책</h1>
      <p className="mb-8 text-xs text-ink-soft">서비스가 글을 어떻게 배정하고 다루는지 안내해요.</p>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="mb-2 text-sm text-ink">1. 오늘의 글감</h2>
          <p>
            에세이 / 상상·소설 / 자기계발 / 비평 / 자유주제 중 그날의 글감 하나가 날짜를 기준으로
            자동으로 정해져요. 직접 카테고리를 고를 수는 없고, 같은 날에는 누가 접속하든 같은
            글감이 주어져요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">2. 분량과 자동 저장</h2>
          <p>
            입력 후 1초가 지나면 글자 수와 무관하게 자동으로 저장되므로, 1,000자를 채우기 전이라도
            브라우저를 닫으면 그대로 남아 이어서 쓸 수 있어요. 다만 완료 처리는 1,000자를 채워야만
            할 수 있어요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">3. 완료와 하루 잠금</h2>
          <p>
            1,000자를 채우면 완료 버튼이 활성화되고, 완료하면 규칙 기반 첨삭 노트를 확인할 수
            있어요. 완료한 글은 그날 안에는 다시 수정할 수 없도록 잠기며, 다음 글감은 다음 날 새로
            주어져요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">4. 자정을 넘기며 쓸 때</h2>
          <p>
            글을 쓰기 시작한 뒤 자정을 넘기더라도, 그 세션 동안은 시작한 날짜의 글로 계속 저장돼요.
            새로고침하거나 다시 접속하면 그 시점의 날짜 기준으로 이어가거나 새 글감을 받게 돼요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">5. 아카이브에 남는 글</h2>
          <p>
            아카이브와 모음집에는 완료한 글만 남아요. 완료하지 않은 미완성 초고는 하루가 지나면
            다시 이어 쓸 수 없고, 목록에도 노출되지 않아요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">6. 첨삭 노트의 성격</h2>
          <p>
            문장 길이, 접속사·강조어 반복, 문단 구성 등을 훑어보는 규칙 기반 분석이에요. 전문적인
            첨삭이나 평가를 대체하지 않으니 참고 자료로만 활용해주세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">7. 글 삭제</h2>
          <p>
            개별 글만 골라 지우는 기능은 아직 없어요. 글을 지우려면 설정에서 회원 탈퇴를 통해
            계정에 저장된 글 전체를 한 번에 삭제해야 해요.
          </p>
        </section>
      </div>
    </div>
  )
}
