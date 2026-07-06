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

// updated_at은 보내지 않는다 — schema.sql의 트리거가 항상 서버 시각으로 채운다
// (기기 시계를 신뢰하지 않기 위함)
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
  }
}

// 내가 쓴 모든 글을 서버에서 가져온다 (기기 간 동기화용)
export async function pullEntries(userId: string): Promise<DraftEntry[]> {
  const { data, error } = await supabase.from('entries').select('*').eq('user_id', userId)
  if (error) throw error
  return (data as EntryRow[]).map(fromRow)
}

// 초고 하나를 서버에 저장(upsert)하고, 서버가 기록한 최신 상태(특히 서버 시각 기준
// updated_at)를 돌려받아 반환한다. 실패하면 null을 반환하고 호출부가 처리하게 한다.
export async function pushEntry(userId: string, entry: DraftEntry): Promise<DraftEntry | null> {
  const { data, error } = await supabase
    .from('entries')
    .upsert(toRow(entry, userId), { onConflict: 'user_id,date,category' })
    .select()
    .single()
  if (error) {
    captureError(error, { where: 'pushEntry', date: entry.date, category: entry.category })
    return null
  }
  return fromRow(data as EntryRow)
}

// 회원 탈퇴 시 계정에 남은 글 데이터를 전부 삭제한다
export async function deleteAllEntries(userId: string): Promise<void> {
  const { error } = await supabase.from('entries').delete().eq('user_id', userId)
  if (error) throw error
}
