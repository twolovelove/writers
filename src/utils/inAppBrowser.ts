export type InAppBrowser = 'kakaotalk' | 'instagram' | 'naver' | 'line' | 'facebook' | null

// Google은 인앱 브라우저(WebView)에서의 OAuth 로그인을 보안 정책으로 차단한다
// (disallowed_useragent 403). 카카오톡/인스타그램 등으로 공유된 링크를 그 안에서 그대로
// 열면 로그인이 막히므로, User-Agent로 감지해 외부 브라우저로 유도한다.
export function detectInAppBrowser(): InAppBrowser {
  const ua = navigator.userAgent
  if (/KAKAOTALK/i.test(ua)) return 'kakaotalk'
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/NAVER\(/i.test(ua)) return 'naver'
  if (/\bLine\//i.test(ua)) return 'line'
  if (/FBAN|FBAV/i.test(ua)) return 'facebook'
  return null
}

// 카카오톡 인앱 브라우저는 이 URL 스킴으로 현재 페이지를 기기 기본 브라우저에서 다시 열 수 있다.
export function openInExternalBrowser() {
  const current = window.location.href
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(current)}`
}
