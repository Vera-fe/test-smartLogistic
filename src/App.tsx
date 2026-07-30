import {Outlet} from '@tanstack/react-router'
import './index.css'//ошибка Cannot find module './index.css' or its corresponding type declarations.

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">Грузовые аукционы</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    )
}

export default App
