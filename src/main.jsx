import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { CalendarApp } from './CalendarApp.jsx'
import { store } from './store'

import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={ store }>
      <HashRouter>
        <CalendarApp />
      </HashRouter>
    </Provider>
  </StrictMode>,
)
