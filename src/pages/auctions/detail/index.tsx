import {useQuery} from '@tanstack/react-query'
import {useParams, Link} from '@tanstack/react-router'
import {apiClient} from '../../../shared/api/client'
import type {Auction} from '../../../shared/types/auction'

export function AuctionDetailPage() {
    const {auctionUuid} = useParams({from: '/auctions/$auctionUuid'})

    const {data: auction, isLoading, error} = useQuery({
        queryKey: ['auction', auctionUuid],
        queryFn: async () => {
            const response = await apiClient.get<Auction>(`/auctions/${auctionUuid}`)
            return response.data
        },
        enabled: !!auctionUuid,
    })

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        )
    }

    if (error || !auction) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Ошибка загрузки аукциона
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Назад к списку
            </Link>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Шапка */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{auction.cargo_num}</h1>
                            <div className="flex gap-2 mt-1">
                                <span className={`px-2 py-1 text-xs rounded ${auction.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {auction.status}
                                </span>
                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                    {auction.auc_type}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded ${auction.is_bidder ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {auction.is_bidder ? 'Моя ставка есть' : 'Нет ставки'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                                {auction.current_price.toLocaleString()} ₽
                            </div>
                            {auction.price_per_km && (
                                <div className="text-sm text-gray-500">
                                    {auction.price_per_km} ₽/км
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Основная информация */}
                <div className="p-6 space-y-6">
                    {/* Маршрут */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Маршрут</h3>
                        <div className="mt-2 flex items-center gap-2 text-lg">
                            <span className="font-medium">{auction.load_city}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium">{auction.unload_city}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                            {new Date(auction.load_date).toLocaleDateString()} → {new Date(auction.unload_date).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Груз */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Груз</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">Название</div>
                                <div className="font-medium">{auction.cargo_name}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Вес</div>
                                <div className="font-medium">{auction.weight} кг</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Объём</div>
                                <div className="font-medium">{auction.volume} м³</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Тип кузова</div>
                                <div className="font-medium">{auction.body_type}</div>
                            </div>
                        </div>
                    </div>

                    {/* Параметры торгов */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Параметры торгов</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {auction.bid_step && (
                                <div>
                                    <div className="text-sm text-gray-500">Шаг ставки</div>
                                    <div className="font-medium">{auction.bid_step.toLocaleString()} ₽</div>
                                </div>
                            )}
                            {auction.trading.min_price && (
                                <div>
                                    <div className="text-sm text-gray-500">Мин. цена</div>
                                    <div className="font-medium">{auction.trading.min_price.toLocaleString()} ₽</div>
                                </div>
                            )}
                            {auction.trading.max_price && (
                                <div>
                                    <div className="text-sm text-gray-500">Макс. цена</div>
                                    <div className="font-medium">{auction.trading.max_price.toLocaleString()} ₽</div>
                                </div>
                            )}
                            <div>
                                <div className="text-sm text-gray-500">Торговый статус</div>
                                <div className="font-medium">{auction.user_status}</div>
                            </div>
                        </div>
                    </div>

                    {/* Действия */}
                    <div className="pt-4 border-t">
                        <div className="flex flex-wrap gap-3">
                            {auction.trading.can_set_bet ? (
                                <Link
                                    to="/auctions/$auctionUuid/bets"
                                    params={{auctionUuid: auction.uuid}}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    {auction.is_bidder ? 'Изменить ставку' : 'Сделать ставку'}
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="px-6 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                                >
                                    Ставки недоступны
                                </button>
                            )}

                            {!auction.trading.hide_bets_history && (
                                <Link
                                    to="/auctions/$auctionUuid/bets"
                                    params={{auctionUuid: auction.uuid}}
                                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                                >
                                    Смотреть ставки
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Ограничения DTO */}
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                        <div className="text-gray-500 font-semibold mb-1">Информация о доступе:</div>
                        <ul className="space-y-1 text-gray-600">
                            <li>• can_set_bet: {auction.trading.can_set_bet ? '✅' : '❌'}</li>
                            <li>• hide_bets_history: {auction.trading.hide_bets_history ? '✅' : '❌'}</li>
                            <li>• hide_points_address_and_contacts: {auction.trading.hide_points_address_and_contacts ? '✅' : '❌'}</li>
                            <li>• no_view_cargo_price: {auction.trading.no_view_cargo_price ? '✅' : '❌'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
