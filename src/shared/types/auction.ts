// Типы для аукционов
export type AuctionStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED' | 'COMPLETED'
export type AuctionType = 'Request' | 'Up' | 'Down' | 'FixPrice'
export type UserStatus = 'Leading' | 'Losing' | 'Winner' | 'NoBid' | 'Outbid'

// Настройки торгов
export interface TradingSettings {
    can_set_bet: boolean
    hide_bets_history: boolean
    hide_points_address_and_contacts: boolean
    no_view_cargo_price: boolean
    min_price?: number
    max_price?: number
    step?: number
}

// Модель аукциона
export interface Auction {
    uuid: string
    cargo_num: string
    status: AuctionStatus
    auc_type: AuctionType
    load_city: string
    unload_city: string
    load_date: string
    unload_date: string
    cargo_name: string
    weight: number
    volume: number
    body_type: string
    current_price: number
    price_per_km?: number
    bid_step?: number
    is_available: boolean
    is_bidder: boolean
    trading: TradingSettings
    user_status: UserStatus
}

// Модель ставки
export interface Bet {
    id: string
    price: number
    price_with_nds?: number
    carrier: string
    rating_position?: number
    is_winner: boolean
    is_cancelled: boolean
    cancel_reason?: string | null
    created_at?: string
}

// Ответы от API
export interface AuctionsListResponse {
    items: Auction[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface BetsResponse {
    bets: Bet[]
    totalParticipants: number
    hideHistory: boolean
}

// Параметры запроса для списка
export interface AuctionsListParams {
    page?: number
    limit?: number
}

// Параметры для ставки
export interface PlaceBetParams {
    price: number
}

// Параметры фильтрации
export interface AuctionsFilters {
    cargo_num?: string
    status?: AuctionStatus
    statuses?: AuctionStatus[]
    auc_type?: AuctionType
    load_city?: string
    unload_city?: string
    load_date_from?: string
    load_date_to?: string
    is_available?: boolean
    is_bidder?: boolean
    price_from?: number
    price_to?: number
}

// Мок-словарь городов
export const CITIES = [
    'Москва',
    'Санкт-Петербург',
    'Казань',
    'Екатеринбург',
    'Нижний Новгород',
    'Челябинск',
    'Красноярск',
    'Самара',
    'Уфа',
    'Новосибирск',
    'Ростов-на-Дону',
    'Воронеж',
    'Пермь',
    'Волгоград',
    'Краснодар',
] as const

export type City = typeof CITIES[number]
