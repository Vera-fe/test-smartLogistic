import {http, HttpResponse} from 'msw'
import type {Auction, AuctionsListResponse, BetsResponse} from '../shared/types/auction'

// Уникальные мок-данные
const mockAuctions: Auction[] = [
    {
        uuid: '1',
        cargo_num: 'CARGO-001',
        status: 'ACTIVE',
        auc_type: 'Request',
        load_city: 'Москва',
        unload_city: 'Санкт-Петербург',
        load_date: '2026-08-01',
        unload_date: '2026-08-03',
        cargo_name: 'Строительные материалы',
        weight: 1500,
        volume: 20,
        body_type: 'Тент',
        current_price: 45000,
        price_per_km: 150,
        bid_step: 1000,
        is_available: true,
        is_bidder: false,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '2',
        cargo_num: 'CARGO-002',
        status: 'ACTIVE',
        auc_type: 'Up',
        load_city: 'Казань',
        unload_city: 'Нижний Новгород',
        load_date: '2026-08-05',
        unload_date: '2026-08-06',
        cargo_name: 'Продукты питания',
        weight: 800,
        volume: 15,
        body_type: 'Рефрижератор',
        current_price: 32000,
        price_per_km: 120,
        bid_step: 500,
        is_available: true,
        is_bidder: true,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'Leading',
    },
    {
        uuid: '3',
        cargo_num: 'CARGO-003',
        status: 'CLOSED',
        auc_type: 'FixPrice',
        load_city: 'Екатеринбург',
        unload_city: 'Челябинск',
        load_date: '2026-07-20',
        unload_date: '2026-07-22',
        cargo_name: 'Оборудование',
        weight: 2500,
        volume: 30,
        body_type: 'Открытый',
        current_price: 68000,
        price_per_km: 200,
        bid_step: 2000,
        is_available: false,
        is_bidder: false,
        trading: {
            can_set_bet: false,
            hide_bets_history: true,
            hide_points_address_and_contacts: true,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '4',
        cargo_num: 'CARGO-004',
        status: 'ACTIVE',
        auc_type: 'Down',
        load_city: 'Новосибирск',
        unload_city: 'Красноярск',
        load_date: '2026-08-10',
        unload_date: '2026-08-12',
        cargo_name: 'Уголь',
        weight: 5000,
        volume: 40,
        body_type: 'Полуприцеп',
        current_price: 75000,
        price_per_km: 180,
        bid_step: 1500,
        is_available: true,
        is_bidder: false,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '5',
        cargo_num: 'CARGO-005',
        status: 'COMPLETED',
        auc_type: 'Request',
        load_city: 'Самара',
        unload_city: 'Уфа',
        load_date: '2026-06-15',
        unload_date: '2026-06-17',
        cargo_name: 'Зерно',
        weight: 3000,
        volume: 25,
        body_type: 'Тент',
        current_price: 40000,
        price_per_km: 140,
        bid_step: 800,
        is_available: false,
        is_bidder: false,
        trading: {
            can_set_bet: false,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '6',
        cargo_num: 'CARGO-006',
        status: 'CANCELLED',
        auc_type: 'FixPrice',
        load_city: 'Ростов-на-Дону',
        unload_city: 'Воронеж',
        load_date: '2026-07-01',
        unload_date: '2026-07-03',
        cargo_name: 'Металлопрокат',
        weight: 4000,
        volume: 35,
        body_type: 'Открытый',
        current_price: 55000,
        price_per_km: 160,
        bid_step: 1200,
        is_available: false,
        is_bidder: false,
        trading: {
            can_set_bet: false,
            hide_bets_history: true,
            hide_points_address_and_contacts: true,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '7',
        cargo_num: 'CARGO-007',
        status: 'ACTIVE',
        auc_type: 'Up',
        load_city: 'Пермь',
        unload_city: 'Екатеринбург',
        load_date: '2026-08-15',
        unload_date: '2026-08-16',
        cargo_name: 'Химикаты',
        weight: 1200,
        volume: 18,
        body_type: 'Рефрижератор',
        current_price: 38000,
        price_per_km: 130,
        bid_step: 600,
        is_available: true,
        is_bidder: true,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'Leading',
    },
    {
        uuid: '8',
        cargo_num: 'CARGO-008',
        status: 'ACTIVE',
        auc_type: 'Request',
        load_city: 'Волгоград',
        unload_city: 'Краснодар',
        load_date: '2026-08-20',
        unload_date: '2026-08-22',
        cargo_name: 'Строительный песок',
        weight: 8000,
        volume: 50,
        body_type: 'Самосвал',
        current_price: 90000,
        price_per_km: 220,
        bid_step: 2500,
        is_available: true,
        is_bidder: false,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '9',
        cargo_num: 'CARGO-009',
        status: 'CLOSED',
        auc_type: 'Down',
        load_city: 'Санкт-Петербург',
        unload_city: 'Москва',
        load_date: '2026-07-25',
        unload_date: '2026-07-27',
        cargo_name: 'Бытовая техника',
        weight: 2000,
        volume: 22,
        body_type: 'Тент',
        current_price: 50000,
        price_per_km: 145,
        bid_step: 1000,
        is_available: false,
        is_bidder: false,
        trading: {
            can_set_bet: false,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'NoBid',
    },
    {
        uuid: '10',
        cargo_num: 'CARGO-010',
        status: 'ACTIVE',
        auc_type: 'FixPrice',
        load_city: 'Нижний Новгород',
        unload_city: 'Казань',
        load_date: '2026-08-08',
        unload_date: '2026-08-09',
        cargo_name: 'Автозапчасти',
        weight: 900,
        volume: 12,
        body_type: 'Фургон',
        current_price: 28000,
        price_per_km: 110,
        bid_step: 400,
        is_available: true,
        is_bidder: true,
        trading: {
            can_set_bet: true,
            hide_bets_history: false,
            hide_points_address_and_contacts: false,
            no_view_cargo_price: false,
        },
        user_status: 'Leading',
    },
]

interface ListRequestParams {
    page?: number
    limit?: number
    cargo_num?: string
    status?: string
    auc_type?: string
    load_city?: string
    unload_city?: string
    is_available?: boolean
    is_bidder?: boolean
    price_from?: string
    price_to?: string
}

interface BetRequestParams {
    price: number
}

export const handlers = [
    http.post('/api/auctions/list', async ({request}) => {
        const body = (await request.json()) as ListRequestParams
        const {page = 1, limit = 10, ...filters} = body

        console.log('🔍 Фильтры:', filters) // Для отладки

        let filtered = [...mockAuctions]

        // Фильтр по номеру заявки (регистронезависимый частичный поиск)
        if (filters.cargo_num) {
            const searchTerm = filters.cargo_num.toLowerCase().trim()
            filtered = filtered.filter((a) =>
                a.cargo_num.toLowerCase().includes(searchTerm)
            )
            console.log('📝 Фильтр по номеру:', searchTerm, 'Найдено:', filtered.length)
        }

        // Фильтр по статусу
        if (filters.status) {
            filtered = filtered.filter((a) => a.status === filters.status)
            console.log('📝 Фильтр по статусу:', filters.status, 'Найдено:', filtered.length)
        }

        // Фильтр по типу аукциона
        if (filters.auc_type) {
            filtered = filtered.filter((a) => a.auc_type === filters.auc_type)
            console.log('📝 Фильтр по типу:', filters.auc_type, 'Найдено:', filtered.length)
        }

        // Фильтр по городу погрузки
        if (filters.load_city) {
            filtered = filtered.filter((a) => a.load_city === filters.load_city)
            console.log('📝 Фильтр по городу погрузки:', filters.load_city, 'Найдено:', filtered.length)
        }

        // Фильтр по городу выгрузки
        if (filters.unload_city) {
            filtered = filtered.filter((a) => a.unload_city === filters.unload_city)
            console.log('📝 Фильтр по городу выгрузки:', filters.unload_city, 'Найдено:', filtered.length)
        }

        // Фильтр по доступности
        if (filters.is_available !== undefined && filters.is_available !== null) {
            const isAvailable = filters.is_available === true
            filtered = filtered.filter((a) => a.is_available === isAvailable)
            console.log('📝 Фильтр по доступности:', isAvailable, 'Найдено:', filtered.length)
        }

        // Фильтр по наличию ставки
        if (filters.is_bidder !== undefined && filters.is_bidder !== null) {
            const isBidder = filters.is_bidder === true
            filtered = filtered.filter((a) => a.is_bidder === isBidder)
            console.log('📝 Фильтр по ставке:', isBidder, 'Найдено:', filtered.length)
        }

        // Фильтр по цене от
        if (filters.price_from) {
            const priceFrom = Number(filters.price_from)
            filtered = filtered.filter((a) => a.current_price >= priceFrom)
            console.log('📝 Фильтр по цене от:', priceFrom, 'Найдено:', filtered.length)
        }

        // Фильтр по цене до
        if (filters.price_to) {
            const priceTo = Number(filters.price_to)
            filtered = filtered.filter((a) => a.current_price <= priceTo)
            console.log('📝 Фильтр по цене до:', priceTo, 'Найдено:', filtered.length)
        }

        console.log('✅ Итоговый результат:', filtered.length, 'аукционов')

        // Пагинация
        const start = (page - 1) * limit
        const end = start + limit
        const items = filtered.slice(start, end)

        const response: AuctionsListResponse = {
            items,
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit),
        }

        return HttpResponse.json(response)
    }),

    http.get('/api/auctions/:uuid', ({params}) => {
        const {uuid} = params
        const auction = mockAuctions.find((a) => a.uuid === uuid)

        if (!auction) {
            return new HttpResponse(null, {status: 404})
        }

        return HttpResponse.json(auction)
    }),

    http.get('/api/auctions/:uuid/bets', ({params}) => {
        const {uuid} = params
        const auction = mockAuctions.find((a) => a.uuid === uuid)

        if (!auction) {
            return new HttpResponse(null, {status: 404})
        }

        const response: BetsResponse = {
            bets: [
                {
                    id: 'b1',
                    price: auction.current_price + 1000,
                    price_with_nds: (auction.current_price + 1000) * 1.1,
                    carrier: 'ООО "Транспорт-Сервис"',
                    rating_position: 1,
                    is_winner: true,
                    is_cancelled: false,
                    cancel_reason: undefined,
                    created_at: new Date().toISOString(),
                },
                {
                    id: 'b2',
                    price: auction.current_price,
                    price_with_nds: auction.current_price * 1.1,
                    carrier: 'ИП "Петров"',
                    rating_position: 2,
                    is_winner: false,
                    is_cancelled: false,
                    cancel_reason: undefined,
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                },
            ],
            totalParticipants: 2,
            hideHistory: auction.trading.hide_bets_history,
        }

        return HttpResponse.json(response)
    }),

    http.post('/api/auctions/:uuid/bets', async ({params, request}) => {
        const body = (await request.json()) as BetRequestParams

        if (!body.price || body.price <= 0) {
            return new HttpResponse(
                JSON.stringify({message: 'Цена должна быть больше 0'}),
                {status: 422}
            )
        }

        const auction = mockAuctions.find((a) => a.uuid === params.uuid)
        if (!auction) {
            return new HttpResponse(null, {status: 404})
        }

        const updatedAuction = {
            ...auction,
            current_price: body.price,
            is_bidder: true,
            user_status: 'Leading' as const,
        }

        const index = mockAuctions.findIndex((a) => a.uuid === params.uuid)
        if (index !== -1) {
            mockAuctions[index] = updatedAuction
        }

        return HttpResponse.json({
            success: true,
            message: 'Ставка успешно установлена',
        })
    }),
]
