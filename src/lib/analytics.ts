declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// GA4 측정 ID(VITE_GA_MEASUREMENT_ID)가 설정된 경우에만 gtag.js를 로드한다.
// 설정이 없으면(로컬 개발 등) 아무 것도 하지 않는다.
export function initAnalytics() {
  if (!MEASUREMENT_ID) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)
}

// 글감 이탈/작성 시작/완료 같은 핵심 지점을 GA4 이벤트로 보낸다.
// 측정 ID가 없으면 조용히 아무 것도 하지 않는다.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
