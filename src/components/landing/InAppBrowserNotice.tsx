import type { InAppBrowser } from '../../utils/inAppBrowser'
import { openInExternalBrowser } from '../../utils/inAppBrowser'

interface Props {
  browser: InAppBrowser
}

const APP_NAMES: Record<Exclude<InAppBrowser, null>, string> = {
  kakaotalk: '카카오톡',
  instagram: '인스타그램',
  naver: '네이버',
  line: '라인',
  facebook: '페이스북',
}

// 카카오톡은 외부 브라우저로 강제 전환하는 URL 스킴이 있어 버튼 하나로 해결되지만,
// 나머지 인앱 브라우저는 그런 스킴이 없어 유저가 직접 메뉴에서 열어야 한다.
export function InAppBrowserNotice({ browser }: Props) {
  if (!browser) return null

  return (
    <div className="mb-6 w-full rounded-2xl bg-paper-cream px-5 py-4 text-left text-sm text-ink-soft">
      <p>
        {APP_NAMES[browser]} 브라우저에서는 구글 로그인이 제한돼요.{' '}
        {browser === 'kakaotalk'
          ? '아래 버튼으로 Chrome에서 열어주세요.'
          : '우측 상단 메뉴(⋯)에서 "다른 브라우저로 열기"를 선택한 뒤 다시 로그인해주세요.'}
      </p>
      {browser === 'kakaotalk' && (
        <button
          type="button"
          onClick={openInExternalBrowser}
          className="mt-3 w-full rounded-full bg-ink py-2.5 text-sm text-paper transition-colors duration-200 hover:bg-accent-indigo"
        >
          Chrome에서 열기
        </button>
      )}
    </div>
  )
}
