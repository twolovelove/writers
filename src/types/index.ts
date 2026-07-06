// 글쓰기 카테고리 종류
export type Category = '에세이' | '상상/소설' | '자기계발' | '비평' | '자유주제'

// 글감(Prompt) 하나의 데이터 구조
export interface WritingPrompt {
  id: string
  category: Category
  title: string
  description: string
}

// LocalStorage에 저장되는 하루치 글쓰기 기록
export interface DraftEntry {
  date: string // YYYY-MM-DD
  category: Category
  promptId: string
  content: string // 에디터 원문 (마크다운 서식 포함)
  charCount: number
  completed: boolean
  updatedAt: string // ISO timestamp
}
