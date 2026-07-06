import { ArrowLeft, LogOut, ShieldCheck, Trash2, FileDown } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { deleteAllEntries } from '../lib/entries'
import type { Session } from '@supabase/supabase-js'

interface Props {
  session: Session
  onBack: () => void
  onLogout: () => void
  onOpenTerms: () => void
  onOpenCompilation: () => void
}

function clearLocalWritingData() {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('writer:')) keysToRemove.push(key)
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

// Page: 개인정보 안내와 데이터 삭제/회원 탈퇴를 다루는 설정 화면.
// 글 데이터는 로그인 계정에 연결되어 Supabase에 백업되며, 본인만 열람할 수 있다.
export function Settings({ session, onBack, onLogout, onOpenTerms, onOpenCompilation }: Props) {
  const handleDeleteData = () => {
    if (
      !window.confirm(
        '이 기기에 저장된 글 데이터를 지울까요? 계정에 백업된 글은 남아있어 다음 로그인 시 다시 내려받아져요.',
      )
    )
      return
    clearLocalWritingData()
    window.location.reload()
  }

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        '회원 탈퇴를 진행할까요? 계정에 백업된 글과 이 기기의 글 데이터가 모두 삭제되고 로그아웃돼요. 삭제된 글은 복구할 수 없어요.',
      )
    )
      return
    await deleteAllEntries(session.user.id)
    clearLocalWritingData()
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
          기기가 바뀌어도 이어서 볼 수 있도록 Supabase에 백업돼요. 본인 계정으로 로그인했을 때만
          열람할 수 있고, 관리자를 포함한 다른 누구도 볼 수 없어요. 보유기간 제한은 없으며, 아래에서
          언제든 직접 삭제할 수 있어요.
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-paper-line p-6">
        <p className="text-sm text-ink">로그아웃</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          이 기기에서 로그아웃해요. 글 데이터는 그대로 남아있어요.
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

      <section className="mb-6 rounded-2xl border border-paper-line p-6">
        <p className="text-sm text-ink">이 기기의 글 데이터 삭제</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          이 기기에 저장된 글과 설정을 지워요. 로그인 상태는 유지되며, 계정에 백업된 글은 다음
          로그인 시 이 기기로 다시 내려받아져요.
        </p>
        <button
          type="button"
          onClick={handleDeleteData}
          className="mt-4 flex items-center gap-1.5 rounded-full border border-paper-line px-4 py-2 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink"
        >
          <Trash2 size={13} strokeWidth={1.75} />
          글 데이터 삭제
        </button>
      </section>

      <section className="rounded-2xl border border-paper-line p-6">
        <p className="text-sm text-ink">회원 탈퇴</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          계정에 백업된 글과 이 기기의 글 데이터를 모두 지우고 로그아웃해요. 한 번 삭제하면 되돌릴
          수 없으니, 탈퇴 전에 지금까지 쓴 글을 모음집에서 PDF로 저장해두는 걸 권장해요. 로그인 계정
          자체(이메일 등)를 완전히 삭제하려면 별도 절차가 필요해 관리자에게 문의해주세요.
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

      <button
        type="button"
        onClick={onOpenTerms}
        className="mt-6 w-fit text-xs text-ink-soft/60 underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
      >
        이용약관 보기
      </button>
    </div>
  )
}
