'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { Earning } from '@/types'
import { IndianRupee, TrendingUp, Wallet, Banknote, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  revenue: number
  commission: number
}

export default function EarningsPage() {
  const { user } = useAuthStore()
  const doctorId = user?.id || ''
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEarnings() {
      if (!doctorId) return
      try {
        const data = await DoctorConsultationApi.getEarnings(doctorId)
        setEarnings(data)
      } catch {
        console.error('Failed to load earnings')
      } finally {
        setLoading(false)
      }
    }
    fetchEarnings()
  }, [doctorId])

  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const dailyRevenue = earnings
    .filter((e) => e.created_at.startsWith(today))
    .reduce((sum, e) => sum + e.net_amount, 0)

  const weeklyRevenue = earnings
    .filter((e) => e.created_at >= weekAgo)
    .reduce((sum, e) => sum + e.net_amount, 0)

  const monthlyRevenue = earnings
    .filter((e) => e.created_at >= monthStart)
    .reduce((sum, e) => sum + e.net_amount, 0)

  const totalEarnings = earnings.reduce((sum, e) => sum + e.net_amount, 0)
  const totalCommission = earnings.reduce((sum, e) => sum + e.commission, 0)
  const totalGross = earnings.reduce((sum, e) => sum + e.amount, 0)

  const chartData: ChartData[] = []
  const daysMap = new Map<string, { revenue: number; commission: number }>()

  earnings.forEach((e) => {
    const day = e.created_at.split('T')[0]
    if (!daysMap.has(day)) {
      daysMap.set(day, { revenue: 0, commission: 0 })
    }
    const entry = daysMap.get(day)!
    entry.revenue += e.net_amount
    entry.commission += e.commission
  })

  const sorted = Array.from(daysMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  sorted.slice(-14).forEach(([date, val]) => {
    chartData.push({
      name: formatDate(date, 'MMM dd'),
      revenue: val.revenue,
      commission: val.commission,
    })
  })

  const pendingSettlements = earnings.filter((e) => e.payment_status === 'pending')
  const completedSettlements = earnings.filter((e) => e.payment_status === 'completed')

  const paymentStatusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
    pending: 'warning',
    completed: 'success',
    refunded: 'destructive',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Earnings</h2>
        <p className="text-muted-foreground">Track your revenue and commission breakdown</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={IndianRupee} label="Daily Revenue" value={formatCurrency(dailyRevenue)} />
        <StatsCard icon={Wallet} label="Weekly Revenue" value={formatCurrency(weeklyRevenue)} trend={{ value: 10, positive: true }} />
        <StatsCard icon={TrendingUp} label="Monthly Revenue" value={formatCurrency(monthlyRevenue)} trend={{ value: 18, positive: true }} />
        <StatsCard icon={Banknote} label="Total Earnings" value={formatCurrency(totalEarnings)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend (Last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Net Revenue" />
                    <Bar dataKey="commission" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Commission" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gross Revenue</span>
                <span className="font-medium">{formatCurrency(totalGross)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Commission</span>
                <span className="font-medium text-red-600">-{formatCurrency(totalCommission)}</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between text-sm font-bold">
                <span>Net Earnings</span>
                <span className="text-emerald-600">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Settlements</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <Badge variant="warning">{pendingSettlements.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <Badge variant="success">{completedSettlements.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="hidden sm:table-cell">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Commission</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No transactions yet
                  </TableCell>
                </TableRow>
              )}
              {earnings.slice(0, 10).map((e) => (
                <TableRow key={e.earning_id}>
                  <TableCell className="text-sm">{formatDate(e.created_at, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{e.earning_id.slice(0, 8)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{formatCurrency(e.amount)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-red-600">-{formatCurrency(e.commission)}</TableCell>
                  <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(e.net_amount)}</TableCell>
                  <TableCell>
                    <Badge variant={paymentStatusVariant[e.payment_status] || 'default'}>{e.payment_status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
