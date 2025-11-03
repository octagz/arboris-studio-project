import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Log mock mode status on startup
if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
  console.log('🧪 Mock Data Mode Enabled - Using mock data instead of API calls');
} else {
  console.log('🚀 Production Mode - Using Perplexity API');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
