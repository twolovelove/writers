import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

interface Props {
  session: Session
}

// 대시보드 하단의 작은 리뷰 칸. "어떤 기능을 원하세요? 잘 쓰고 계신가요?" 같은
// 가벼운 피드백을 받아 Supabase reviews 테이블에 저장한다 (관리자만 조회 가능).
export function ReviewWidget({ session }: Props) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!message.trim()) return
    setStatus('sending')
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: session.user.id,
        email: session.user.email,
        message: message.trim(),
      })
      if (error) throw error
      setMessage('')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-dashed border-paper-line p-6 text-center">
      <div className="mx-auto flex items-center justify-center gap-1.5 text-ink-soft">
        <MessageCircle size={14} strokeWidth={1.75} />
        <p className="text-xs tracking-wide">어떤 기능을 원하세요? 또는 잘 쓰고 계신가요?</p>
      </div>

      {status === 'sent' ? (
        <p className="mt-4 text-sm text-accent-green">소중한 의견 감사해요. 잘 전달됐어요.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="편하게 남겨주세요"
            className="flex-1 rounded-full border border-paper-line bg-paper px-4 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'sending' || !message.trim()}
            className="rounded-full bg-ink px-5 py-2 text-xs tracking-wide text-paper transition-colors hover:bg-accent-indigo disabled:cursor-not-allowed disabled:opacity-40"
          >
            보내기
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="mt-3 text-xs text-ink-soft">
          전송에 실패했어요. Supabase에 reviews 테이블이 준비되어 있는지 확인해주세요.
        </p>
      )}
    </div>
  )
}
