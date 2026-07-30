import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useParams, Link, useNavigate} from '@tanstack/react-router'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {apiClient} from '../../../shared/api/client'
import type {Bet, Auction} from '../../../shared/types/auction'
import toast from 'react-hot-toast'

// Схема валидации для ставки с русскими сообщениями
const betSchema = z.object({
    price: z
        .string()
        .min(1, 'Введите цену')
        .refine((val) => !isNaN(Number(val)), 'Введите число')
        .transform(Number)
        .refine((val) => val > 0, 'Цена должна быть больше 0'),
})

// Тип для данных формы (price как строка)
type BetFormData = z.infer<typeof betSchema>

// Тип для данных отправки на сервер (price как число)
type BetSubmitData = {
    price: number
}

export function AuctionBetsPage() {
    const {auctionUuid} = useParams({from: '/auctions/$auctionUuid/bets'})
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {data: auction} = useQuery({
        queryKey: ['auction', auctionUuid],
        queryFn: async () => {
            const response = await apiClient.get<Auction>(`/auctions/${auctionUuid}`)
            return response.data
        },
    })

    const {data: betsData, isLoading, error} = useQuery({
        queryKey: ['bets', auctionUuid],
        queryFn: async () => {
            const response = await apiClient.get(`/auctions/${auctionUuid}/bets`)
            return response.data
        },
        enabled: !!auctionUuid,
    })

    const placeBetMutation = useMutation({
        mutationFn: async (data: BetSubmitData) => {
            const response = await apiClient.post(`/auctions/${auctionUuid}/bets`, {
                price: data.price,
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['auctions']})
            queryClient.invalidateQueries({queryKey: ['auction', auctionUuid]})
            queryClient.invalidateQueries({queryKey: ['bets', auctionUuid]})
            toast.success('Ставка успешно установлена!')
            navigate({to: '/auctions/$auctionUuid', params: {auctionUuid}})
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Ошибка при установке ставки')
        },
    })

    const {register, handleSubmit, formState: {errors}} = useForm<BetFormData>({
        resolver: zodResolver(betSchema),
        defaultValues: {
            price: String(auction?.current_price || 0),
        },
    })

    const onSubmit = (data: BetFormData) => {
        // Преобразуем данные формы в данные для отправки
        const submitData: BetSubmitData = {
            price: Number(data.price),
        }
        placeBetMutation.mutate(submitData)
    }

    if (betsData?.hideHistory) {
        return (
            <div className="max-w-4xl mx-auto">
                <Link to="/auctions/$auctionUuid" params={{auctionUuid}} className="text-blue-600 hover:underline mb-4 inline-block">
                    ← Назад к аукциону
                </Link>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">История ставок скрыта организатором</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (error || !betsData) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Ошибка загрузки ставок
                </div>
            </div>
        )
    }

    const canSetBet = auction?.trading.can_set_bet ?? false
    const isBidder = auction?.is_bidder ?? false

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/auctions/$auctionUuid" params={{auctionUuid}} className="text-blue-600 hover:underline mb-4 inline-block">
                ← Назад к аукциону
            </Link>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Ставки</h2>
                    <div className="text-sm text-gray-600">
                        Участников: {betsData.totalParticipants}
                    </div>
                </div>

                {canSetBet && (
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-lg mb-3">
                            {isBidder ? 'Изменить ставку' : 'Сделать ставку'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Цена (₽)
                                </label>
                                <input
                                    type="number"
                                    {...register('price')}
                                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Введите цену"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                )}
                                {auction?.trading.min_price && (
                                    <p className="mt-1 text-xs text-gray-500">Мин. цена: {auction.trading.min_price.toLocaleString()} ₽</p>
                                )}
                                {auction?.trading.max_price && (
                                    <p className="text-xs text-gray-500">Макс. цена: {auction.trading.max_price.toLocaleString()} ₽</p>
                                )}
                                {auction?.trading.step && (
                                    <p className="text-xs text-gray-500">Шаг: {auction.trading.step.toLocaleString()} ₽</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={placeBetMutation.isPending}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {placeBetMutation.isPending ? 'Отправка...' : (isBidder ? 'Изменить' : 'Отправить')}
                            </button>
                        </form>
                    </div>
                )}

                {betsData.bets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Пока нет ни одной ставки
                    </div>
                ) : (
                    <div className="space-y-3">
                        {betsData.bets.map((bet: Bet) => (
                            <div
                                key={bet.id}
                                className={`p-4 border rounded-lg ${bet.is_winner ? 'bg-green-50 border-green-200' :
                                    bet.is_cancelled ? 'bg-gray-50 border-gray-200 opacity-60' :
                                        'bg-white border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">
                                            {bet.carrier}
                                            {bet.is_winner && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                                    Победитель
                                                </span>
                                            )}
                                            {bet.is_cancelled && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                                    Отменена
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {bet.created_at && new Date(bet.created_at).toLocaleString()}
                                        </div>
                                        {bet.cancel_reason && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                Причина отмены: {bet.cancel_reason}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-lg">
                                            {bet.price.toLocaleString()} ₽
                                        </div>
                                        {bet.price_with_nds && (
                                            <div className="text-sm text-gray-500">
                                                {bet.price_with_nds.toLocaleString()} ₽ с НДС
                                            </div>
                                        )}
                                        {bet.rating_position && (
                                            <div className="text-sm text-gray-500">
                                                #{bet.rating_position} в рейтинге
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
