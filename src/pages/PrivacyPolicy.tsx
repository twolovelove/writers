import { ArrowLeft } from 'lucide-react'
import { SUPPORT_EMAIL } from '../config'

interface Props {
  onBack: () => void
  onOpenTerms?: () => void
}

// Page: 로그인 화면에서 이동할 수 있는 개인정보처리방침. 로그인 여부와 무관하게 볼 수 있어야 하므로
// App.tsx에서 세션 체크보다 앞단에서 라우팅된다.
export function PrivacyPolicy({ onBack, onOpenTerms }: Props) {
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

      <h1 className="mb-2 text-2xl text-ink sm:text-3xl">개인정보처리방침</h1>
      <p className="mb-8 text-xs text-ink-soft">시행일자: 2026년 7월 6일</p>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="mb-2 text-sm text-ink">1. 수집하는 개인정보 항목</h2>
          <p>
            Google 계정으로 로그인할 때 이메일 주소를 수집합니다. 별도의 회원가입 절차나 추가 정보
            입력은 없습니다. 서비스 내에서 의견을 남기는 경우, 로그인한 이메일 주소·계정 식별자(사용자
            ID)와 작성한 메시지 내용이 함께 저장되며, 운영자(관리자)가 문의 대응을 위해 열람합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">2. 개인정보의 수집 및 이용 목적</h2>
          <p>
            이메일 주소는 로그인 상태를 식별하고 여러 기기에서 동일한 계정으로 서비스를 이용할 수
            있도록 하는 용도로만 사용됩니다. 의견(피드백)으로 남긴 이메일과 메시지는 문의에 답하거나
            서비스를 개선하는 목적으로만 사용됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">3. 글쓰기 데이터의 보관 방식</h2>
          <p>
            작성한 글의 내용은 로그인 계정에 연결된 Supabase 서버에만 저장되어, 기기가 바뀌어도
            이어서 볼 수 있습니다. 서버에 저장된 글은 접근 권한(RLS)으로 보호되어 본인 계정으로
            로그인했을 때만 열람할 수 있으며, 서비스 운영자를 포함한 다른 누구도 열람할 수 없습니다.
            개별 글 삭제 기능은 없으며, 회원 탈퇴 시 계정과 함께 서버에 저장된 모든 글이 완전히
            삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">4. 개인정보의 보유 및 이용 기간</h2>
          <p>
            로그인 정보(이메일)는 회원 탈퇴 전까지 보유하며, 별도의 보유기간 제한을 두지 않습니다.
            의견으로 남긴 메시지는 서비스 개선 목적이 달성된 후 삭제될 수 있습니다. 이용자는 설정
            화면에서 언제든 회원 탈퇴를 요청할 수 있으며, 탈퇴 시 계정과 작성한 글이 모두 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">5. 개인정보의 제3자 제공</h2>
          <p>
            수집한 개인정보는 법령에 특별한 규정이 있는 경우를 제외하고 제3자에게 제공되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">6. 이용자의 권리</h2>
          <p>
            이용자는 언제든 자신의 개인정보 열람, 정정, 삭제를 요청할 수 있으며, 회원 탈퇴를 통해
            로그인 정보 이용을 중단할 수 있습니다. 계정 자체의 완전한 삭제가 필요한 경우 아래 문의처로
            연락해주세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-sm text-ink">7. 문의처</h2>
          <p>
            개인정보 처리와 관련한 문의는 아래 이메일로 연락해주세요.
            <br />
            <span className="text-ink">{SUPPORT_EMAIL}</span>
          </p>
        </section>
      </div>

      {onOpenTerms && (
        <button
          type="button"
          onClick={onOpenTerms}
          className="mt-10 w-fit text-xs text-ink-soft/60 underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          이용약관 보기
        </button>
      )}
    </div>
  )
}
