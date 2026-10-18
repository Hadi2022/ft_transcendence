import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='p-5 text-2xl'>Hola mundo!</div>
  </StrictMode>,
)
