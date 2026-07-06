import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Editor } from './pages/Editor'
import { Archive } from './pages/Archive'
import { EntryView } from './pages/EntryView'
import { Compilation } from './pages/Compilation'
import { getAllDrafts } from './utils/archive'
import type { Category, DraftEntry, WritingPrompt } from './types'

type View =
  | { name: 'dashboard' }
  | { name: 'editor'; category: Category; prompt: WritingPrompt }
  | { name: 'archive' }
  | { name: 'entry'; entry: DraftEntry; from: 'dashboard' | 'archive' }
  | { name: 'compilation' }

function App() {
  const [view, setView] = useState<View>({ name: 'dashboard' })

  if (view.name === 'editor') {
    return (
      <Editor
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

  return (
    <Dashboard
      onStartWriting={(category, prompt) => setView({ name: 'editor', category, prompt })}
      onOpenArchive={() => setView({ name: 'archive' })}
      onViewEntry={(entry) => setView({ name: 'entry', entry, from: 'dashboard' })}
    />
  )
}

export default App
