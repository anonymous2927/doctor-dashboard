'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useAppointmentStore } from '@/store/appointment-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency, formatDate, formatTime, getInitials } from '@/lib/utils/format'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { DashboardStats, Appointment, Earning, Doctor } from '@/types'
import {
  CalendarCheck,
  CalendarRange,
  CheckCircle2,
  Users,
  IndianRupee,
  TrendingUp,
  Star,
  ClipboardList,
  Clock,
  Stethoscope,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { setAppointments } = useAppointmentStore()
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedConsultations: 0,
    totalPatients: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
    averageRating: 0,
    pendingFollowups: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  const doctorId = user?.id || ''

  useEffect(() => {
    async function fetchData() {
      if (!doctorId) return
      try {
        const appointments = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        setAppointments(appointments)
        setRecentAppointments(appointments.slice(0, 5))

        let profile: Doctor | null = null
        try {
          profile = await DoctorConsultationApi.getDoctorProfile(doctorId)
          setDoctor(profile)
        } catch {
          // profile optional
        }

        const earningsData = await DoctorConsultationApi.getEarnings(doctorId)

        const today = new Date().toISOString().split('T')[0]
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        const todayApps = appointments.filter(
          (a) => a.appointment_date === today
        )
        const upcomingApps = appointments.filter(
          (a) => a.appointment_date > today && a.status === 'confirmed'
        )
        const completed = appointments.filter(
          (a) => a.status === 'completed'
        )
        const uniquePatients = new Set(
          appointments.map((a) => a.patient_id)
        )
        const revenueToday = earningsData
          .filter((e) => e.created_at.startsWith(today))
          .reduce((sum, e) => sum + e.net_amount, 0)
        const revenueThisMonth = earningsData
          .filter((e) => {
            const d = new Date(e.created_at)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
          })
          .reduce((sum, e) => sum + e.net_amount, 0)
        const avgRating = profile?.rating || 4.5
        const pendingFollowups = appointments.filter(
          (a) => a.status === 'completed'
        ).length

        setStats({
          todayAppointments: todayApps.length,
          upcomingAppointments: upcomingApps.length,
          completedConsultations: completed.length,
          totalPatients: uniquePatients.size,
          revenueToday,
          revenueThisMonth,
          averageRating: avgRating,
          pendingFollowups: pendingFollowups,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [doctorId, setAppointments])

  const docName = user?.user_metadata?.full_name || doctor?.full_name || 'Doctor'

  const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
    pending: 'warning', confirmed: 'default', completed: 'success', cancelled: 'destructive', rejected: 'destructive',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, Dr. {docName.split(' ').pop() || 'Doctor'}
        </h2>
        <p className="text-muted-foreground">Here&apos;s your practice overview for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={CalendarCheck} label="Today's Appointments" value={stats.todayAppointments} trend={{ value: 12, positive: true }} />
        <StatsCard icon={CalendarRange} label="Upcoming" value={stats.upcomingAppointments} trend={{ value: 8, positive: true }} />
        <StatsCard icon={CheckCircle2} label="Completed" value={stats.completedConsultations} trend={{ value: 5, positive: false }} />
        <StatsCard icon={Users} label="Total Patients" value={stats.totalPatients} trend={{ value: 20, positive: true }} />
        <StatsCard icon={IndianRupee} label="Revenue Today" value={formatCurrency(stats.revenueToday)} />
        <StatsCard icon={TrendingUp} label="Revenue This Month" value={formatCurrency(stats.revenueThisMonth)} trend={{ value: 15, positive: true }} />
        <StatsCard icon={Star} label="Average Rating" value={stats.averageRating.toFixed(1)} iconClassName="text-amber-500" />
        <StatsCard icon={ClipboardList} label="Pending Follow-ups" value={stats.pendingFollowups} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Appointments</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/appointments">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No recent appointments
                    </TableCell>
                  </TableRow>
                )}
                {recentAppointments.map((apt) => (
                  <TableRow key={apt.appointment_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {getInitials(apt.patient_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{apt.patient_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{formatDate(apt.appointment_date, 'MMM dd')}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{formatTime(apt.appointment_time)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[apt.status] || 'default'}>{apt.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/dashboard/availability">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Create Availability</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/dashboard/appointments">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">View Appointments</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/dashboard/earnings">
                <IndianRupee className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Check Earnings</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/dashboard/patients">
                <Users className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">View Patients</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
              <Link href="/dashboard/prescriptions">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Write Prescription</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
