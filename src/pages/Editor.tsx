import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { EditorToolbar } from '../components/EditorToolbar'
import { ProgressBar } from '../components/ProgressBar'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { useDraft } from '../hooks/useDraft'
import { applyFormat, renderPreview, type FormatType } from '../utils/textFormat'
import { generateFeedback } from '../utils/feedback'
import { toISODate } from '../utils/date'
import { trackEvent } from '../lib/analytics'
import type { Category, WritingPrompt } from '../types'

interface Props {
  session: Session
  category: Category
  prompt: WritingPrompt
  onBack: () => void
}

// Page 2: 종이 원고지 느낌의 텍스트 에디터. 벨로그 스타일 서식 도구, 실시간 글자 수,
// 자동 저장, 목표 달성 피드백을 모두 이 화면에서 처리한다.
export function Editor({ session, category, prompt, onBack }: Props) {
  const date = toISODate(new Date())
  const {
    title,
    setTitle,
    content,
    setContent,
    charCount,
    goal,
    progress,
    isGoalMet,
    saveNow,
    feedback,
    saveFeedback,
  } = useDraft(date, category, prompt.id, session.user.id)
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFormat = (type: FormatType) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const result = applyFormat({ value, selectionStart, selectionEnd }, type)
    setContent(result.value)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey
    if (!mod) return
    const key = e.key.toLowerCase()
    if (key === 'b') {
      e.preventDefault()
      handleFormat('bold')
    } else if (key === 'i') {
      e.preventDefault()
      handleFormat('italic')
    } else if (key === 'u') {
      e.preventDefault()
      handleFormat('underline')
    } else if (e.shiftKey && key === 's') {
      e.preventDefault()
      handleFormat('strikethrough')
    } else if (e.shiftKey && key === 'q') {
      e.preventDefault()
      handleFormat('quote')
    }
  }

  const handleComplete = () => {
    saveNow()
    saveFeedback(generateFeedback(content))
    trackEvent('writing_completed', { category, char_count: charCount })
  }

  const handleBack = () => {
    if (feedback === null) {
      trackEvent('writing_exited_incomplete', { category, char_count: charCount })
    }
    onBack()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12 sm:py-16">
      <button
        type="button"
        onClick={handleBack}
        className="mb-8 flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        대시보드로
      </button>

      <div className="mb-6 rounded-xl bg-paper-cream/60 px-5 py-4">
        <p className="text-xs tracking-[0.2em] text-accent-indigo">{category} · 오늘의 글감</p>
        <p className="mt-1 text-base text-ink">{prompt.title}</p>
      </div>

      <div className="flex-1 rounded-2xl border border-paper-line bg-paper shadow-paper">
        <div className="pt-4">
          <EditorToolbar onFormat={handleFormat} isPreview={isPreview} onTogglePreview={() => setIsPreview((v) => !v)} />
        </div>

        {!isPreview && (
          <div className="flex items-center gap-2 border-b border-paper-line/70 px-6 pb-4 pt-5 sm:px-8">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="min-w-0 flex-1 bg-transparent text-xl text-ink placeholder:text-ink-soft/50 focus:outline-none"
            />
            {!title && (
              <span className="shrink-0 whitespace-nowrap text-xs tracking-[0.1em] text-ink-soft/50">선택</span>
            )}
          </div>
        )}

        <div className="min-h-[420px] px-6 py-6 sm:px-8">
          {isPreview && title && <h2 className="mb-4 text-xl text-ink">{title}</h2>}
          {isPreview ? (
            <div
              className="prose-paper min-h-[420px] text-lg leading-[2.1] text-ink"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) || '<p class="text-ink-soft">아직 쓴 내용이 없습니다.</p>' }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="원고지를 펼치듯, 오늘 떠오른 생각을 편하게 적어보세요."
              className="min-h-[420px] w-full resize-none bg-transparent text-lg leading-[2.1] text-ink placeholder:text-ink-soft/60 focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-ink-soft">
          <span>
            <span className={isGoalMet ? 'font-medium text-accent-green' : 'font-medium text-ink'}>
              {charCount.toLocaleString()}
            </span>{' '}
            / {goal.toLocaleString()}자
          </span>
          <span>{progress}%</span>
        </div>

        <ProgressBar progress={progress} isGoalMet={isGoalMet} />

        <button
          type="button"
          disabled={!isGoalMet || feedback !== null}
          onClick={handleComplete}
          className={[
            'mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm tracking-wide transition-all duration-300',
            feedback !== null
              ? 'cursor-default bg-paper-line text-ink-soft/70'
              : isGoalMet
                ? 'animate-pop-in bg-accent-green text-paper shadow-card hover:opacity-90'
                : 'cursor-not-allowed bg-paper-line text-ink-soft/70',
          ].join(' ')}
        >
          <CheckCircle2 size={17} strokeWidth={1.75} />
          {feedback !== null ? '오늘의 글쓰기를 완료했습니다' : '오늘의 글쓰기 완료'}
        </button>

        {feedback && <FeedbackPanel items={feedback} onBackToDashboard={handleBack} />}
      </div>
    </div>
  )
}
