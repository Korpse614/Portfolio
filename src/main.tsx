import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ProwlerTrial from './ProwlerTrial.tsx'

const isProwlerTrial = new URLSearchParams(window.location.search).get('trial') === 'prowler'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isProwlerTrial ? <ProwlerTrial /> : <App />}
  </StrictMode>,
)
