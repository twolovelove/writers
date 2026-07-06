import { supabase } from './supabaseClient'
import { captureError } from './monitoring'
import type { Category, DraftEntry, FeedbackItem } from '../types'

interface EntryRow {
  date: string
  category: Category
  prompt_id: string
  title: string
  content: string
  char_count: number
  completed: boolean
  feedback: FeedbackItem[] | null
  updated_at: string
}

function fromRow(row: EntryRow): DraftEntry {
  return {
    date: row.date,
    category: row.category,
    promptId: row.prompt_id,
    title: row.title,
    content: row.content,
    charCount: row.char_count,
    completed: row.completed,
    updatedAt: row.updated_at,
    ...(row.feedback ? { feedback: row.feedback } : {}),
  }
}

function toRow(entry: DraftEntry, userId: string) {
  return {
    user_id: userId,
    date: entry.date,
    category: entry.category,
    prompt_id: entry.promptId,
    title: entry.title,
    content: entry.content,
    char_count: entry.charCount,
    completed: entry.completed,
    feedback: entry.feedback ?? null,
    updated_at: entry.updatedAt,
  }
}

// 내가 쓴 모든 글을 서버에서 가져온다 (기기 간 동기화용)
export async function pullEntries(userId: string): Promise<DraftEntry[]> {
  const { data, error } = await supabase.from('entries').select('*').eq('user_id', userId)
  if (error) throw error
  return (data as EntryRow[]).map(fromRow)
}

// 초고 하나를 서버에 저장(upsert). 실패해도 다음 저장 시점에 다시 시도되므로 조용히 무시한다.
export async function pushEntry(userId: string, entry: DraftEntry): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .upsert(toRow(entry, userId), { onConflict: 'user_id,date,category' })
  if (error) captureError(error, { where: 'pushEntry', date: entry.date, category: entry.category })
}

// 회원 탈퇴 시 계정에 남은 글 데이터를 전부 삭제한다
export async function deleteAllEntries(userId: string): Promise<void> {
  const { error } = await supabase.from('entries').delete().eq('user_id', userId)
  if (error) throw error
}
