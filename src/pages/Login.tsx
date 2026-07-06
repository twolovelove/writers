import { PenLine } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

// Page: 로그인 전 진입 화면. Google 계정으로 로그인하면 여러 기기에서
// 같은 계정으로 글쓰기 기록을 이어갈 수 있다.
export function Login() {
  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-paper-cream text-accent-indigo">
        <PenLine size={22} strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl text-ink">매일 1,000자 글쓰기</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        로그인하면 어떤 기기에서든 같은 계정으로 글쓰기 기록을 이어갈 수 있어요.
      </p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-8 w-full rounded-full bg-ink py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
      >
        Google 계정으로 계속하기
      </button>
    </div>
  )
}
