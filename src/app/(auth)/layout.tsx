import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 8h10M7 12h10M7 16h8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-600">Carenium</span>
              <span className="ml-2 text-[10px] font-semibold text-gray-400 tracking-[2px]">DOCTOR HUB</span>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center pt-16">
        {children}
      </main>
    </div>
  )
}
