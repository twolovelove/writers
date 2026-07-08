import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'
import { Archive } from './pages/Archive'
import { EntryView } from './pages/EntryView'
import { Compilation } from './pages/Compilation'
import { Login } from './pages/Login'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { WritingPolicy } from './pages/WritingPolicy'
import { Settings } from './pages/Settings'
import { AdminReviews } from './pages/AdminReviews'
import { useSession } from './hooks/useSession'
import { useEntries } from './hooks/useEntries'
import { supabase } from './lib/supabaseClient'
import { toISODate } from './utils/date'
import type { Category, DraftEntry, WritingPrompt } from './types'

type View =
  | { name: 'dashboard' }
  | { name: 'editor'; category: Category; prompt: WritingPrompt }
  | { name: 'archive' }
  | { name: 'entry'; entry: DraftEntry; from: 'dashboard' | 'archive' }
  | { name: 'compilation'; from: 'archive' | 'settings' }
  | { name: 'settings' }
  | { name: 'admin' }

function App() {
  const [view, setView] = useState<View>({ name: 'dashboard' })
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showWritingPolicy, setShowWritingPolicy] = useState(false)
  const { session, loading } = useSession()
  const userId = session?.user.id ?? null
  const { entries, loading: entriesLoading, upsertEntry } = useEntries(userId)

  if (loading) return null
  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} onOpenTerms={() => setShowTerms(true)} />
  }
  if (showTerms) return <TermsOfService onBack={() => setShowTerms(false)} />
  if (!session) {
    return <Login onOpenPrivacy={() => setShowPrivacy(true)} onOpenTerms={() => setShowTerms(true)} />
  }
  if (entriesLoading) return null
  if (showWritingPolicy) {
    return <WritingPolicy onBack={() => setShowWritingPolicy(false)} />
  }

  if (view.name === 'editor') {
    const today = toISODate(new Date())
    const initialEntry =
      entries.find((entry) => entry.date === today && entry.category === view.category) ?? null
    return (
      <Editor
        session={session}
        category={view.category}
        prompt={view.prompt}
        initialEntry={initialEntry}
        onSaved={upsertEntry}
        onBack={() => setView({ name: 'dashboard' })}
      />
    )
  }

  if (view.name === 'archive') {
    return (
      <Archive
        entries={entries}
        onBack={() => setView({ name: 'dashboard' })}
        onOpenEntry={(entry) => setView({ name: 'entry', entry, from: 'archive' })}
        onOpenCompilation={() => setView({ name: 'compilation', from: 'archive' })}
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
    return (
      <Compilation
        entries={entries}
        onBack={() => setView(view.from === 'settings' ? { name: 'settings' } : { name: 'archive' })}
      />
    )
  }

  if (view.name === 'settings') {
    return (
      <Settings
        session={session}
        onBack={() => setView({ name: 'dashboard' })}
        onLogout={() => supabase.auth.signOut()}
        onOpenTerms={() => setShowTerms(true)}
        onOpenWritingPolicy={() => setShowWritingPolicy(true)}
        onOpenCompilation={() => setView({ name: 'compilation', from: 'settings' })}
      />
    )
  }

  if (view.name === 'admin') {
    return <AdminReviews onBack={() => setView({ name: 'dashboard' })} />
  }

  return (
    <Dashboard
      session={session}
      entries={entries}
      onStartWriting={(category, prompt) => setView({ name: 'editor', category, prompt })}
      onOpenArchive={() => setView({ name: 'archive' })}
      onOpenSettings={() => setView({ name: 'settings' })}
      onOpenAdmin={() => setView({ name: 'admin' })}
      onViewEntry={(entry) => setView({ name: 'entry', entry, from: 'dashboard' })}
    />
  )
}

export default App
