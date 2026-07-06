import { ArrowLeft } from 'lucide-react'
import { SUPPORT_EMAIL } from '../config'

interface Props {
  onBack: () => void
}

// Page: 로그인 화면에서 이동할 수 있는 이용약관. 로그인 여부와 무관하게 볼 수 있어야 하므로
// App.tsx에서 세션 체크보다 앞단에서 라우팅된다.
export function TermsOfService({ onBack }: Props) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        돌아가기
      </button>

      <h1 className="mb-2 text-2xl text-ink sm:text-3xl">이용약관</h1>
      <p className="mb-8 text-xs text-ink-soft">시행일자: 2026년 7월 6일</p>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="mb-2 text-sm text-ink">1. 서비스 소개</h2>
          <p>
            "매일 1,000자 글쓰기"(이하 "서비스")는 매일 주어지는 글감으로 글쓰기 습관을 만들 수
            있도록 돕는 개인 프로젝트입니다. Google 계정으로 로그인하면 여러 기기에서 같은 계정으로
            글쓰기 기록을 이어갈 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">2. 게시물(작성한 글)의 저작권</h2>
          <p>
            이용자가 서비스 내에서 작성한 글의 저작권은 전적으로 이용자 본인에게 있습니다. 서비스는
            글을 저장·백업·열람하는 기능을 제공할 뿐, 이용자의 동의 없이 그 내용을 이용, 공개,
            배포하거나 제3자에게 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">3. 글감 및 첨삭 노트의 성격</h2>
          <p>
            서비스가 제공하는 글감은 자체 제작한 고정 목록에서 선택되며, 첨삭 노트는 문장 길이나
            반복 표현 등을 기계적으로 훑어보는 규칙 기반 분석입니다. 전문적인 첨삭이나 평가를
            대체하지 않으며, 참고 자료로만 활용해주세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">4. 이용자의 의무</h2>
          <p>
            이용자는 타인의 저작권 등 권리를 침해하는 내용을 작성하거나, 서비스를 본래 목적과 다르게
            악용하지 않아야 합니다. 이를 위반하여 발생하는 책임은 해당 이용자 본인에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">5. 서비스의 변경 및 중단</h2>
          <p>
            서비스는 개인 프로젝트로 운영되며, 기능이 추가·변경되거나 사전 고지 후 서비스 제공이
            중단될 수 있습니다. 데이터 보관 방식에 관한 사항은 개인정보처리방침을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">6. 약관의 변경</h2>
          <p>
            약관이 변경되는 경우 서비스 내 공지 또는 이 페이지의 시행일자 갱신을 통해 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">7. 문의처</h2>
          <p>
            이용약관과 관련한 문의는 아래 이메일로 연락해주세요.
            <br />
            <span className="text-ink">{SUPPORT_EMAIL}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
