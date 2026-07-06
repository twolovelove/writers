import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'
import { Archive } from './pages/Archive'
import { EntryView } from './pages/EntryView'
import { Compilation } from './pages/Compilation'
import { Login } from './pages/Login'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Settings } from './pages/Settings'
import { AdminReviews } from './pages/AdminReviews'
import { getAllDrafts } from './utils/archive'
import { useSession } from './hooks/useSession'
import { useEntrySync } from './hooks/useEntrySync'
import { supabase } from './lib/supabaseClient'
import type { Category, DraftEntry, WritingPrompt } from './types'

type View =
  | { name: 'dashboard' }
  | { name: 'editor'; category: Category; prompt: WritingPrompt }
  | { name: 'archive' }
  | { name: 'entry'; entry: DraftEntry; from: 'dashboard' | 'archive' }
  | { name: 'compilation' }
  | { name: 'settings' }
  | { name: 'admin' }

function App() {
  const [view, setView] = useState<View>({ name: 'dashboard' })
  const [showPrivacy, setShowPrivacy] = useState(false)
  const { session, loading } = useSession()
  const { syncing } = useEntrySync(session?.user.id ?? null)

  if (loading) return null
  if (showPrivacy) return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />
  if (!session) return <Login onOpenPrivacy={() => setShowPrivacy(true)} />
  if (syncing) return null

  if (view.name === 'editor') {
    return (
      <Editor
        session={session}
        category={view.category}
        prompt={view.prompt}
        onBack={() => setView({ name: 'dashboard' })}
      />
    )
  }

  if (view.name === 'archive') {
    return (
      <Archive
        onBack={() => setView({ name: 'dashboard' })}
        onOpenEntry={(entry) => setView({ name: 'entry', entry, from: 'archive' })}
        onOpenCompilation={() => setView({ name: 'compilation' })}
      />
    )
  }

  if (view.name === 'entry') {
    return (
      <EntryView
        entry={view.entry}
        onBack={() => setView(view.from === 'archive' ? { name: 'archive' } : { name: 'dashboard' })}
      />
    )
  }

  if (view.name === 'compilation') {
    return <Compilation entries={getAllDrafts()} onBack={() => setView({ name: 'archive' })} />
  }

  if (view.name === 'settings') {
    return (
      <Settings
        session={session}
        onBack={() => setView({ name: 'dashboard' })}
        onLogout={() => supabase.auth.signOut()}
      />
    )
  }

  if (view.name === 'admin') {
    return <AdminReviews onBack={() => setView({ name: 'dashboard' })} />
  }

  return (
    <Dashboard
      session={session}
      onStartWriting={(category, prompt) => setView({ name: 'editor', category, prompt })}
      onOpenArchive={() => setView({ name: 'archive' })}
      onOpenSettings={() => setView({ name: 'settings' })}
      onOpenAdmin={() => setView({ name: 'admin' })}
      onViewEntry={(entry) => setView({ name: 'entry', entry, from: 'dashboard' })}
    />
  )
}

export default App
