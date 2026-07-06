import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

interface Props {
  session: Session
}

// 대시보드 하단의 작은 리뷰 트리거. 평소엔 눈에 띄지 않는 텍스트 버튼으로만 있다가,
// 클릭하면 모달로 피드백 입력창이 뜬다. Supabase reviews 테이블에 저장 (관리자만 조회 가능).
export function ReviewWidget({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false)
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

  const handleClose = () => {
    setIsOpen(false)
    setStatus('idle')
  }

  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs text-ink-soft/60 transition-colors hover:text-ink-soft"
      >
        <MessageCircle size={13} strokeWidth={1.75} />
        의견 남기기
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-6"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="animate-pop-in w-full max-w-sm rounded-2xl border border-paper-line bg-paper-cream p-6 shadow-card"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="text-sm text-ink-soft">어떤 기능을 원하세요? 또는 잘 쓰고 계신가요?</p>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 text-ink-soft/50 transition-colors hover:text-ink"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>

            {status === 'sent' ? (
              <p className="text-sm text-accent-green">소중한 의견 감사해요. 잘 전달됐어요.</p>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="편하게 남겨주세요"
                  autoFocus
                  className="rounded-full border border-paper-line bg-paper px-4 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
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
        </div>
      )}
    </div>
  )
}
