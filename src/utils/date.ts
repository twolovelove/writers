// Date 객체를 LocalStorage 키에 쓰이는 YYYY-MM-DD 형식으로 변환
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// "2026년 7월 6일 월요일" 형식의 한글 날짜 표기
export function formatKoreanDate(date: Date): string {
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일`
}

// "7월 6일" 형식의 짧은 한글 날짜 표기 (아카이브 목록용)
export function formatShortKoreanDate(isoDate: string): string {
  const [, m, d] = isoDate.split('-').map(Number)
  return `${m}월 ${d}일`
}

// 자정(다음 날 00:00)까지 남은 밀리초
export function msUntilNextMidnight(): number {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
  return next.getTime() - now.getTime()
}

// 밀리초를 "HH:MM:SS" 형식으로 변환
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}
