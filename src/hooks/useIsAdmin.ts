import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 로그인한 계정이 admins 테이블(supabase/schema.sql)에 등록되어 있는지 확인한다.
// 관리자 여부의 유일한 기준이 이 테이블이므로, 프론트엔드와 RLS 정책이 항상 같은 값을 본다.
export function useIsAdmin(userId: string | null) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false)
      return
    }

    let cancelled = false
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(data !== null)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  return isAdmin
}
