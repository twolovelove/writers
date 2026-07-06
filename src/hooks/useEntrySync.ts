import { useEffect, useState } from 'react'
import { pullEntries, pushEntry } from '../lib/entries'
import { captureError } from '../lib/monitoring'
import { applyNewerRemoteEntry, getAllDrafts } from '../utils/archive'

function entryKey(entry: { date: string; category: string }) {
  return `${entry.date}:${entry.category}`
}

// 로그인 시점마다 서버와 이 기기의 글을 양방향으로 비교해 최신 쪽으로 맞춘다.
// 기존에 로컬에만 있던 글은 이 과정에서 서버로 올라가고(최초 마이그레이션 겸용),
// 다른 기기에서 쓴 더 최신 글은 이 기기로 내려온다.
export function useEntrySync(userId: string | null) {
  const [syncing, setSyncing] = useState(true)

  useEffect(() => {
    if (!userId) {
      setSyncing(false)
      return
    }

    let cancelled = false
    setSyncing(true)

    async function sync() {
      try {
        const remoteEntries = await pullEntries(userId as string)
        const remoteByKey = new Map(remoteEntries.map((entry) => [entryKey(entry), entry]))
        const localEntries = getAllDrafts()
        const localByKey = new Map(localEntries.map((entry) => [entryKey(entry), entry]))

        for (const remote of remoteEntries) {
          applyNewerRemoteEntry(remote, localByKey.get(entryKey(remote)) ?? null)
        }

        for (const local of localEntries) {
          const remote = remoteByKey.get(entryKey(local))
          if (!remote || local.updatedAt > remote.updatedAt) {
            await pushEntry(userId as string, local)
          }
        }
      } catch (error) {
        captureError(error, { where: 'useEntrySync', userId })
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    sync()
    return () => {
      cancelled = true
    }
  }, [userId])

  return { syncing }
}
