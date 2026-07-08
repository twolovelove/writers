import { useEffect } from 'react'
import { PenLine } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { App as CapacitorApp } from '@capacitor/app'
import { supabase } from '../lib/supabaseClient'

// 네이티브 앱에서는 구글이 인앱 WebView 내 로그인을 차단하므로, 시스템 브라우저를 띄우고
// 이 커스텀 스킴으로 되돌아오게 한다. android/app/src/main/AndroidManifest.xml의
// 인텐트 필터와 Supabase 대시보드의 Redirect URL 허용 목록에도 동일한 값이 등록돼 있어야 한다.
const NATIVE_REDIRECT_URL = 'com.leesarang.writer://login-callback'

// Supabase가 콜백을 PKCE(`?code=`) 또는 암시적 플로우(`#access_token=...`) 중
// 어느 쪽으로 돌려주든 세션을 완성할 수 있도록 둘 다 처리한다.
async function completeNativeLogin(url: string) {
  try {
    const parsed = new URL(url)
    const code = parsed.searchParams.get('code')
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      return
    }

    const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''))
    const access_token = hashParams.get('access_token')
    const refresh_token = hashParams.get('refresh_token')
    if (access_token && refresh_token) {
      await supabase.auth.setSession({ access_token, refresh_token })
    }
  } finally {
    Browser.close()
  }
}

interface Props {
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

// Page: 로그인 전 진입 화면. Google 계정으로 로그인하면 여러 기기에서
// 같은 계정으로 글쓰기 기록을 이어갈 수 있다.
export function Login({ onOpenPrivacy, onOpenTerms }: Props) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listenerPromise = CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      if (!url.startsWith(NATIVE_REDIRECT_URL)) return
      completeNativeLogin(url)
    })

    return () => {
      listenerPromise.then((listener) => listener.remove())
    }
  }, [])

  const handleGoogleLogin = async () => {
    if (Capacitor.isNativePlatform()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: NATIVE_REDIRECT_URL, skipBrowserRedirect: true },
      })
      if (error || !data.url) return
      await Browser.open({ url: data.url })
      return
    }

    supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-paper-cream text-accent-indigo">
        <PenLine size={22} strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl text-ink">매일 1,000자 글쓰기</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        퇴근 후 하루를 정리하듯, 짧은 글감 하나로 매일 1,000자씩 적어보세요. 로그인하면 어떤
        기기에서든 이어서 쓸 수 있어요.
      </p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="mt-8 w-full rounded-full bg-ink py-3 text-sm tracking-wide text-paper transition-colors duration-200 hover:bg-accent-indigo"
      >
        Google 계정으로 계속하기
      </button>

      <div className="mt-5 flex items-center gap-3 text-xs text-ink-soft/60">
        <button
          type="button"
          onClick={onOpenTerms}
          className="underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          이용약관
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="underline-offset-2 transition-colors hover:text-ink-soft hover:underline"
        >
          개인정보처리방침
        </button>
      </div>
    </div>
  )
}
