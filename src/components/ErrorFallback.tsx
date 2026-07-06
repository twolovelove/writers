// 렌더링 중 잡히지 않은 에러가 발생했을 때 앱 전체를 대신 보여주는 화면.
export function ErrorFallback() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-lg text-ink">문제가 발생했어요.</p>
      <p className="mt-2 text-sm text-ink-soft">
        페이지를 새로고침해도 계속되면 잠시 후 다시 시도해주세요.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-6 rounded-full bg-ink px-4 py-2 text-xs tracking-wide text-paper transition-colors hover:bg-accent-indigo"
      >
        새로고침
      </button>
    </div>
  )
}
