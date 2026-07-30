import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {copyFileSync} from 'fs'
import {resolve} from 'path'

export default defineConfig(({mode}) => ({
    plugins: [
        react(),
        {
            name: 'copy-msw',
            closeBundle() {
                try {
                    const src = resolve('public/mockServiceWorker.js')
                    const dest = resolve('dist/mockServiceWorker.js')
                    copyFileSync(src, dest)
                    console.log('✅ mockServiceWorker.js скопирован в dist')
                } catch (e) {
                    const error = e as Error
                    console.warn('⚠️ Не удалось скопировать mockServiceWorker.js:', error.message)
                }
            }
        }
    ],
    base: mode === 'production' ? '/test-smartLogistic/' : '/',
    build: {
        outDir: 'docs',
    },
}))
