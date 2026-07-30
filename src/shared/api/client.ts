import axios from 'axios'

export const apiClient = axios.create({
    baseURL: '/api', // Будет работать через MSW
    headers: {
        'Content-Type': 'application/json',
    },
})

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 422) {
            // Валидационная ошибка
            return Promise.reject(error.response.data)
        }
        return Promise.reject(error)
    }
)
