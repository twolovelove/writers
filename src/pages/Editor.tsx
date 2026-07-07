import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { EditorToolbar } from '../components/EditorToolbar'
import { ProgressBar } from '../components/ProgressBar'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { useDraft } from '../hooks/useDraft'
import { applyFormat, renderPreview, type FormatType } from '../utils/textFormat'
import { generateFeedback } from '../utils/feedback'
import { toISODate } from '../utils/date'
import { trackEvent } from '../lib/analytics'
import type { Category, DraftEntry, WritingPrompt } from '../types'

interface Props {
  session: Session
  category: Category
  prompt: WritingPrompt
  initialEntry: DraftEntry | null
  onSaved: (entry: DraftEntry) => void
  onBack: () => void
}

// Page 2: 종이 원고지 느낌의 텍스트 에디터. 벨로그 스타일 서식 도구, 실시간 글자 수,
// 자동 저장, 목표 달성 피드백을 모두 이 화면에서 처리한다.
export function Editor({ session, category, prompt, initialEntry, onSaved, onBack }: Props) {
  // 마운트 시점에 한 번만 고정 — 자정을 넘겨도 세션 도중에는 같은 날짜로 계속 저장된다.
  // (렌더마다 재계산하면 자정 이후 타이핑 시 date가 바뀌어 초고가 리셋/분기되는 버그가 있었음)
  const [date] = useState(() => toISODate(new Date()))
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
    saveStatus,
    feedback,
    saveFeedback,
  } = useDraft(date, category, prompt.id, session.user.id, initialEntry, onSaved)
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

  const handleManualSave = () => {
    saveNow()
    trackEvent('writing_manual_save', { category, char_count: charCount })
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
        <p className="text-xs tracking-[0.2em] text-accent-indigo">{category} · 오늘의 추천 글감</p>
        <p className="mt-1 text-base text-ink">{prompt.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{prompt.description}</p>
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
        <div className="flex items-center justify-between">
          <span
            className={[
              'text-xs',
              saveStatus === 'error' ? 'text-red-500' : 'text-ink-soft/60',
            ].join(' ')}
          >
            {saveStatus === 'saving' && '자동저장 중...'}
            {saveStatus === 'saved' && '자동저장됨'}
            {saveStatus === 'error' && '저장 실패 · 다시 시도해주세요'}
          </span>
          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === 'saving' || (!title.trim() && !content.trim())}
            className="flex items-center gap-1.5 rounded-full border border-paper-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:bg-paper-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={14} strokeWidth={1.75} />
            임시 저장
          </button>
        </div>

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

        {isGoalMet && feedback === null && (
          <p className="text-center text-xs text-ink-soft/70">
            완료하면 오늘 글은 그대로 간직돼요. 다시 고쳐 쓸 수는 없으니, 한 번 더 읽어보고 눌러주세요.
          </p>
        )}

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
