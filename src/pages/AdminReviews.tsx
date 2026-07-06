import { useEffect, useState } from 'react'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

interface Props {
  onBack: () => void
}

interface Review {
  id: string
  email: string
  message: string
  created_at: string
}

// Page: 관리자 전용 리뷰 목록. RLS 정책상 admins 테이블에 등록된 계정으로 로그인했을 때만
// 실제 데이터가 조회된다 (다른 계정은 빈 목록만 보게 됨).
export function AdminReviews({ onBack }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, email, message, created_at')
          .order('created_at', { ascending: false })
        if (error) throw error
        setReviews(data ?? [])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        대시보드로
      </button>

      <h1 className="mb-1 text-2xl text-ink sm:text-3xl">사용자 리뷰</h1>
      <p className="mb-8 text-sm text-ink-soft">관리자 계정에만 보이는 페이지예요.</p>

      {loading ? (
        <p className="text-sm text-ink-soft">불러오는 중...</p>
      ) : error ? (
        <p className="text-sm text-ink-soft">
          리뷰를 불러오지 못했어요. Supabase에 reviews 테이블(supabase/schema.sql)이 준비되어 있는지 확인해주세요.
        </p>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-paper-line py-16 text-center text-sm text-ink-soft">
          <MessageCircle size={28} strokeWidth={1.5} className="mx-auto mb-3 text-ink-soft/60" />
          아직 도착한 리뷰가 없어요.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-paper-line bg-paper-cream/50 p-5">
              <div className="flex items-center justify-between text-xs text-ink-soft">
                <span>{r.email}</span>
                <span>{new Date(r.created_at).toLocaleString('ko-KR')}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
