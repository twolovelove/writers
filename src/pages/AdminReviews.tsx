import { useEffect, useState } from 'react'
import { ArrowLeft, MessageCircle, PenLine } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAdminAlwaysWrite } from '../hooks/useAdminAlwaysWrite'

interface Props {
  onBack: () => void
}

interface Review {
  id: string
  user_id: string
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
  const [alwaysWrite, setAlwaysWrite] = useAdminAlwaysWrite()

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, user_id, email, message, created_at')
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

      <section className="mb-8 rounded-2xl border border-paper-line bg-paper-cream/50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PenLine size={16} strokeWidth={1.75} className="shrink-0 text-accent-indigo" />
            <div>
              <p className="text-sm text-ink">언제든 글쓰기</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                켜두면 오늘 글을 이미 완료했어도 하루 1회 잠금 없이 계속 쓸 수 있어요(이 관리자
                계정, 이 기기에서만 적용).
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={alwaysWrite}
            onClick={() => setAlwaysWrite(!alwaysWrite)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              alwaysWrite ? 'bg-accent-indigo' : 'bg-paper-line'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-paper transition-transform duration-200 ${
                alwaysWrite ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

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
              <p className="mt-0.5 text-[11px] text-ink-soft/50">유저 ID: {r.user_id}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
