import {setupWorker} from 'msw/browser'
import {handlers} from './handlers'

// Создаем worker с нашими обработчиками
export const worker = setupWorker(...handlers)
