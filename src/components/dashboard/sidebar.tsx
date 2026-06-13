'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth-store'
import { getInitials } from '@/lib/utils/format'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Stethoscope,
  FileText,
  IndianRupee,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/availability', label: 'Availability', icon: Clock },
  { href: '/dashboard/consultations', label: 'Consultations', icon: Stethoscope },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/dashboard/earnings', label: 'Earnings', icon: IndianRupee },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const displayName = user?.user_metadata?.full_name || user?.email || 'Doctor'
  const initials = getInitials(displayName)
  const avatarUrl = user?.user_metadata?.avatar_url || ''

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Carenium</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 border-2 border-emerald-100 dark:border-emerald-900/30">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 text-sm h-9" asChild>
            <Link href="/login">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
