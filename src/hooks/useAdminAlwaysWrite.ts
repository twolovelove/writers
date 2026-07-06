import { useState } from 'react'

const KEY = 'writer:adminAlwaysWrite'

// 관리자 전용 테스트 스위치: 켜두면 오늘 글을 이미 완료했어도 하루 1회 잠금을
// 우회해 계속 새 글을 쓸 수 있다. 이 기기(브라우저)에만 저장되는 로컬 설정이다.
export function useAdminAlwaysWrite() {
  const [enabled, setEnabledState] = useState(() => localStorage.getItem(KEY) === 'true')

  const setEnabled = (next: boolean) => {
    localStorage.setItem(KEY, String(next))
    setEnabledState(next)
  }

  return [enabled, setEnabled] as const
}
