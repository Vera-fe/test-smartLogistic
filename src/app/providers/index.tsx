import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {RouterProvider} from '@tanstack/react-router'
import {Toaster} from 'react-hot-toast'
import {router} from './router'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
        },
    },
})

export function Providers() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </QueryClientProvider>
    )
}
