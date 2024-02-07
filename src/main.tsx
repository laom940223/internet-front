import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
          <BrowserRouter future={{ v7_startTransition: true }}>
              <App />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
  </React.StrictMode>,
)
