import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="rounded bg-indigo-600 px-2 py-0.5 text-sm font-bold text-white">
              GM
            </span>
            <span className="text-lg font-semibold text-gray-900">GlitchMarket</span>
            <span className="text-sm text-gray-400">Admin</span>
          </Link>
          {location.pathname !== '/' && (
            <nav className="flex items-center gap-1 text-sm text-gray-500">
              <span>/</span>
              <Link to="/" className="hover:text-indigo-600">
                Products
              </Link>
              {location.pathname.includes('/edit') && (
                <>
                  <span>/</span>
                  <span className="text-gray-700">Edit</span>
                </>
              )}
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
