import * as Sentry from '@sentry/react'

const DSN = import.meta.env.VITE_SENTRY_DSN
const enabled = Boolean(DSN)

// Sentry DSN(VITE_SENTRY_DSN)이 설정된 경우에만 초기화한다.
// 설정이 없으면(로컬 개발 등) 아무 것도 하지 않는다.
export function initMonitoring() {
  if (!enabled) return
  Sentry.init({ dsn: DSN, environment: import.meta.env.MODE })
}

// 화면은 정상 동작해서 사용자에게 에러를 보여줄 수는 없지만(catch로 흡수한 뒤
// 로컬 데이터로 계속 진행하는 경우 등), 그래도 개발자는 알아야 하는 실패 지점에서 호출한다.
export function captureError(error: unknown, context?: Record<string, unknown>) {
  console.warn(error)
  if (!enabled) return
  Sentry.captureException(error, context ? { extra: context } : undefined)
}

export const ErrorBoundary = Sentry.ErrorBoundary
