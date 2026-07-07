// 글쓰기 카테고리 종류
export type Category = '에세이' | '상상/소설' | '자기계발' | '비평' | '자유주제'

// 글감(Prompt) 하나의 데이터 구조
export interface WritingPrompt {
  id: string
  category: Category
  title: string
  description: string
}

// 첨삭 노트 항목 하나 (칭찬 또는 제안)
export interface FeedbackItem {
  type: 'praise' | 'suggestion'
  message: string
}

// Supabase entries 테이블의 행 데이터 구조 (하루치 글쓰기 기록)
export interface DraftEntry {
  date: string // YYYY-MM-DD
  category: Category
  promptId: string
  title: string // 사용자가 직접 붙인 제목 (비어 있으면 글감 제목으로 대체)
  content: string // 에디터 원문 (마크다운 서식 포함)
  charCount: number
  completed: boolean
  updatedAt: string // ISO timestamp
  feedback?: FeedbackItem[] // 완료 시 생성된 첨삭 노트 (있으면 지난 글 보기에서도 다시 보여준다)
}
