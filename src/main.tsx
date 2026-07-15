import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('ルート要素 #root が見つかりません。index.html を確認してください。')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
