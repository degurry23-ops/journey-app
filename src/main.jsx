import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TripProvider } from './contexts/TripContext'
import { ToastProvider } from './components/Toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <TripProvider>
          <App />
        </TripProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
