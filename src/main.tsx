import React from 'react'
import ReactDOM from 'react-dom/client'
import {Providers} from './app/providers'
import './index.css'

async function enableMocking() {
    if (import.meta.env.DEV) {
        try {
            const {worker} = await import('./mocks/browser')
            return worker.start({
                onUnhandledRequest: 'bypass',
            })
        } catch (error) {
            console.warn('MSW не загрузился:', error)
            return Promise.resolve()
        }
    }
    // В продакшне MSW работает через serviceWorker, который уже в dist
    return Promise.resolve()
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <Providers />
        </React.StrictMode>,
    )
})
