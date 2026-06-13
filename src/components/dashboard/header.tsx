'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth-store'
import { useAppointmentStore } from '@/store/appointment-store'
import { getInitials } from '@/lib/utils/format'
import { Menu, Bell, BellRing } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  onMenuClick: () => void
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuthStore()
  const appointments = useAppointmentStore((s) => s.appointments)

  const displayName = user?.user_metadata?.full_name || user?.email || 'Doctor'
  const initials = getInitials(displayName)
  const avatarUrl = user?.user_metadata?.avatar_url || ''

  const pendingCount = appointments.filter((a) => a.status === 'pending').length

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-lg font-semibold flex-1 truncate">{title}</h1>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-amber-500 text-white text-[10px] font-bold">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pendingCount > 0 ? (
              <DropdownMenuItem className="text-sm">
                You have {pendingCount} pending appointment{pendingCount > 1 ? 's' : ''}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-sm text-muted-foreground">
                No new notifications
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="h-8 w-8 border-2 border-emerald-100 dark:border-emerald-900/30 cursor-pointer">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
