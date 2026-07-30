import {useSearch, useNavigate} from '@tanstack/react-router'
import {useForm} from 'react-hook-form'
import {CITIES} from '../../shared/types/auction'
import {useEffect} from 'react'

type FiltersFormData = {
    cargo_num: string
    status: string
    auc_type: string
    load_city: string
    unload_city: string
    load_date_from: string
    load_date_to: string
    is_available: boolean | undefined
    is_bidder: boolean | undefined
    price_from: string
    price_to: string
}

export function AuctionFilters() {
    const navigate = useNavigate()
    const search = useSearch({from: '/'}) as Record<string, string>

    const {register, handleSubmit, reset} = useForm<FiltersFormData>({
        defaultValues: {
            cargo_num: '',
            status: '',
            auc_type: '',
            load_city: '',
            unload_city: '',
            load_date_from: '',
            load_date_to: '',
            is_available: undefined,
            is_bidder: undefined,
            price_from: '',
            price_to: '',
        },
    })

    useEffect(() => {
        reset({
            cargo_num: search.cargo_num || '',
            status: search.status || '',
            auc_type: search.auc_type || '',
            load_city: search.load_city || '',
            unload_city: search.unload_city || '',
            load_date_from: search.load_date_from || '',
            load_date_to: search.load_date_to || '',
            is_available: search.is_available === 'true' ? true : undefined,
            is_bidder: search.is_bidder === 'true' ? true : undefined,
            price_from: search.price_from || '',
            price_to: search.price_to || '',
        })
    }, [search, reset])

    const onSubmit = (data: FiltersFormData) => {
        const params: Record<string, string> = {}

        if (data.cargo_num) params.cargo_num = data.cargo_num
        if (data.status) params.status = data.status
        if (data.auc_type) params.auc_type = data.auc_type
        if (data.load_city) params.load_city = data.load_city
        if (data.unload_city) params.unload_city = data.unload_city
        if (data.load_date_from) params.load_date_from = data.load_date_from
        if (data.load_date_to) params.load_date_to = data.load_date_to
        // ВАЖНО: отправляем только если значение true
        if (data.is_available === true) {
            params.is_available = 'true'
        }
        if (data.is_bidder === true) {
            params.is_bidder = 'true'
        }
        if (data.price_from) params.price_from = data.price_from
        if (data.price_to) params.price_to = data.price_to

        navigate({
            to: '/',
            search: params,
        })
    }

    const handleReset = () => {
        reset({
            cargo_num: '',
            status: '',
            auc_type: '',
            load_city: '',
            unload_city: '',
            load_date_from: '',
            load_date_to: '',
            is_available: undefined,
            is_bidder: undefined,
            price_from: '',
            price_to: '',
        })

        navigate({
            to: '/',
            search: {},
        })
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Номер заявки
                        </label>
                        <input
                            {...register('cargo_num')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="CARGO-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Статус
                        </label>
                        <select
                            {...register('status')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            <option value="ACTIVE">Активный</option>
                            <option value="CLOSED">Закрыт</option>
                            <option value="CANCELLED">Отменен</option>
                            <option value="COMPLETED">Завершен</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тип аукциона
                        </label>
                        <select
                            {...register('auc_type')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            <option value="Request">Request</option>
                            <option value="Up">Up</option>
                            <option value="Down">Down</option>
                            <option value="FixPrice">FixPrice</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Город погрузки
                        </label>
                        <select
                            {...register('load_city')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            {CITIES.map((city: string) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Город выгрузки
                        </label>
                        <select
                            {...register('unload_city')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Все</option>
                            {CITIES.map((city: string) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата погрузки от
                        </label>
                        <input
                            type="date"
                            {...register('load_date_from')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата погрузки до
                        </label>
                        <input
                            type="date"
                            {...register('load_date_to')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Цена от (₽)
                        </label>
                        <input
                            type="number"
                            {...register('price_from')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="10000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Цена до (₽)
                        </label>
                        <input
                            type="number"
                            {...register('price_to')}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="100000"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                {...register('is_available')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            Доступен
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                {...register('is_bidder')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            Моя ставка
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Применить фильтры
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                        Сбросить
                    </button>
                </div>
            </form>
        </div>
    )
}
