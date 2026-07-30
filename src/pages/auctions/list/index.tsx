import {useQuery, useQueryClient} from '@tanstack/react-query'
import {useNavigate, useSearch} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {apiClient} from '../../../shared/api/client'
import {AuctionFilters} from '../../../widgets/auction-filters'
import type {AuctionsListResponse, Auction} from '../../../shared/types/auction'

export function AuctionsListPage() {
    const navigate = useNavigate()
    const search = useSearch({from: '/'}) as Record<string, string>
    const queryClient = useQueryClient()

    // Определяем количество элементов на странице в зависимости от ширины экрана
    const [limit, setLimit] = useState(9)

    useEffect(() => {
        const updateLimit = () => {
            const width = window.innerWidth
            if (width < 640) { // мобильные устройства (< 640px) - 1 колонка
                setLimit(6)
            } else if (width < 1024) { // планшеты (640px - 1024px) - 2 колонки
                setLimit(8)
            } else { // десктопы (> 1024px) - 3 колонки
                setLimit(9)
            }
        }

        updateLimit()
        window.addEventListener('resize', updateLimit)
        return () => window.removeEventListener('resize', updateLimit)
    }, [])

    const currentPage = Number(search.page) || 1

    // Формируем параметры запроса (исключаем page из фильтров)
    const {...filters} = search
    const queryParams = {
        page: currentPage,
        limit,
        ...filters,
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ['auctions', queryParams],
        queryFn: async () => {
            const response = await apiClient.post<AuctionsListResponse>('/auctions/list', queryParams)
            return response.data
        },
    })

    // Prefetch при наведении
    const prefetchAuction = (uuid: string) => {
        queryClient.prefetchQuery({
            queryKey: ['auction', uuid],
            queryFn: async () => {
                const response = await apiClient.get<Auction>(`/auctions/${uuid}`)
                return response.data
            },
        })
    }

    const handleCardClick = (uuid: string) => {
        navigate({
            to: '/auctions/$auctionUuid',
            params: {auctionUuid: uuid},
        })
    }

    const handlePageChange = (newPage: number) => {
        navigate({
            to: '/',
            search: {...filters, page: newPage},
        })
    }

    if (isLoading) {
        return (
            <div>
                <AuctionFilters />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Ошибка загрузки данных: {error.message}
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Список аукционов</h2>

            <AuctionFilters />

            {data?.items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Аукционы не найдены</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.items.map((auction) => (
                            <div
                                key={auction.uuid}
                                onClick={() => handleCardClick(auction.uuid)}
                                onMouseEnter={() => prefetchAuction(auction.uuid)}
                                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">{auction.cargo_num}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${auction.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {auction.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {auction.load_city} → {auction.unload_city}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">{auction.cargo_name}</p>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <span className="text-lg font-bold text-blue-600">
                                        {auction.current_price.toLocaleString()} ₽
                                    </span>
                                    <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                        {auction.auc_type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Пагинация */}
                    {data && data.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8 flex-wrap">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ←
                            </button>
                            {[...Array(data.totalPages)].map((_, i) => {
                                const pageNum = i + 1
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 border rounded ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === data.totalPages}
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
