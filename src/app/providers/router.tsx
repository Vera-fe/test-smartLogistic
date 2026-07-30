/* eslint-disable react-refresh/only-export-components */
import {createRouter, createRoute, createRootRoute} from '@tanstack/react-router'
import App from '../../App'
import {AuctionsListPage} from '../../pages/auctions/list'
import {AuctionDetailPage} from '../../pages/auctions/detail'
import {AuctionBetsPage} from '../../pages/auctions/bets' // Добавляем импорт

// Корневой маршрут
const rootRoute = createRootRoute({
    component: App,
})

// Маршруты
const auctionsListRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: AuctionsListPage,
})

const auctionDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid',
    component: AuctionDetailPage,
})

const auctionBetsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auctions/$auctionUuid/bets',
    component: AuctionBetsPage, // Теперь используем реальную страницу
})

const routeTree = rootRoute.addChildren([
    auctionsListRoute,
    auctionDetailRoute,
    auctionBetsRoute,
])

export const router = createRouter({
    routeTree,
    context: {},
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
