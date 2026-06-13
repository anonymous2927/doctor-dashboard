'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  className?: string
  iconClassName?: string
}

export function StatsCard({ icon: Icon, label, value, trend, className, iconClassName }: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <Icon className={cn('h-6 w-6 text-emerald-600 dark:text-emerald-400', iconClassName)} />
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
