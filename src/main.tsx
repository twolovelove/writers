import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics.ts'
import { ErrorBoundary, initMonitoring } from './lib/monitoring.ts'
import { ErrorFallback } from './components/ErrorFallback.tsx'

initAnalytics()
initMonitoring()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
