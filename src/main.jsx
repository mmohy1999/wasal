import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Mark document as JS-ready to safely enable initial hidden states for motion
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('js-ready')
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
