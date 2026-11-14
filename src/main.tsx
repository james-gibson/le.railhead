import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { base } from './lib/base'
import './index.css'

const path = window.location.pathname.slice(base.length) || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App path={path} />
  </StrictMode>,
)
