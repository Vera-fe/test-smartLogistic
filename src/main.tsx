import React from 'react'
import ReactDOM from 'react-dom/client'
import {Providers} from './app/providers'
import './index.css'

// ВСЕГДА запускаем приложение, даже если MSW не загрузился
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Providers />
    </React.StrictMode>,
)

// MSW запускаем отдельно
if (import.meta.env.DEV) {
    import('./mocks/browser')
        .then(({worker}) => {
            worker.start({
                onUnhandledRequest: 'bypass',
            })
        })
        .catch((error) => {
            console.warn('MSW не загрузился:', error)
        })
}
