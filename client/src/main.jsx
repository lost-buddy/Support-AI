import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FallingStars } from './components/common/FallingStars.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FallingStars />
    <App />
  </StrictMode>,
)
