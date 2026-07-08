import { ArrowLeft, LogOut, ShieldCheck, Trash2, FileDown } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { deleteAllEntries } from '../lib/entries'
import { captureError } from '../lib/monitoring'
import type { Session } from '@supabase/supabase-js'

interface Props {
  session: Session
  onBack: () => void
  onLogout: () => void
  onOpenTerms: () => void
  onOpenWritingPolicy: () => void
  onOpenCompilation: () => void
}

// Page: 개인정보 안내와 회원 탈퇴를 다루는 설정 화면.
// 글 데이터는 로그인 계정에 연결되어 Supabase에만 저장되며(기기에는 남지 않음), 본인만 열람할 수 있다.
export function Settings({
  session,
  onBack,
  onLogout,
  onOpenTerms,
  onOpenWritingPolicy,
  onOpenCompilation,
}: Props) {
  const handleWithdraw = async () => {
    if (
      !window.confirm(
        '회원 탈퇴를 진행할까요? 로그인 계정과 계정에 저장된 글이 모두 삭제되고 로그아웃돼요. 삭제된 글은 복구할 수 없어요.',
      )
    )
      return

    // 계정 자체(auth.users) 삭제는 서비스 롤 키가 필요해 Edge Function으로 처리한다.
    // entries/reviews/admins는 schema.sql의 on delete cascade로 함께 지워진다.
    const { error } = await supabase.functions.invoke('delete-account')
    if (error) {
      captureError(error, { where: 'handleWithdraw:delete-account', userId: session.user.id })
      // Edge Function이 아직 배포되지 않았거나 실패한 경우, 최소한 이 계정에 남은 글만이라도 지운다
      await deleteAllEntries(session.user.id)
    }

    await supabase.auth.signOut()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        대시보드로
      </button>

      <h1 className="mb-8 text-2xl text-ink sm:text-3xl">설정</h1>

      <section className="mb-6 rounded-2xl border border-paper-line bg-paper-cream/50 p-6">
        <div className="flex items-center gap-2 text-accent-indigo">
          <ShieldCheck size={16} strokeWidth={1.75} />
          <p className="text-xs tracking-[0.2em]">개인정보 안내</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          로그인 계정 <span className="text-ink">{session.user.email}</span>에 글이 연결되어
          Supabase에만 저장되고(기기에는 남지 않아요), 기기가 바뀌어도 이어서 볼 수 있어요. 본인
          계정으로 로그인했을 때만 열람할 수 있고, 관리자를 포함한 다른 누구도 볼 수 없어요.
          보유기간 제한은 없으며, 아래에서 언제든 직접 삭제할 수 있어요.
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-paper-line p-6">
        <p className="text-sm text-ink">로그아웃</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          이 기기에서 로그아웃해요. 글은 계정에 저장되어 있어 그대로 남아있어요.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex items-center gap-1.5 rounded-full border border-paper-line px-4 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
        >
          <LogOut size={13} strokeWidth={1.75} />
          로그아웃
        </button>
      </section>

      <section className="rounded-2xl border border-paper-line p-6">
        <p className="text-sm text-ink">회원 탈퇴</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          로그인 계정과 계정에 저장된 글을 모두 지우고 로그아웃해요. 한 번 삭제하면 되돌릴 수
          없으니, 탈퇴 전에 지금까지 쓴 글을 모음집에서 PDF로 저장해두는 걸 권장해요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenCompilation}
            className="flex items-center gap-1.5 rounded-full border border-paper-line px-4 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
          >
            <FileDown size={13} strokeWidth={1.75} />
            모음집 PDF로 저장하기
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs tracking-wide text-paper transition-colors hover:bg-accent-indigo"
          >
            <Trash2 size={13} strokeWidth={1.75} />
            회원 탈퇴
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onOpenWritingPolicy}
          className="w-fit text-xs text-ink-soft/60 underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          글쓰기 정책 보기
        </button>
        <button
          type="button"
          onClick={onOpenTerms}
          className="w-fit text-xs text-ink-soft/60 underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          이용약관 보기
        </button>
      </div>
    </div>
  )
}
