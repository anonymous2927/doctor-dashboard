'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useAppointmentStore } from '@/store/appointment-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AppointmentCard } from '@/components/dashboard/appointment-card'
import { formatDate, formatTime, getInitials, formatCurrency } from '@/lib/utils/format'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Appointment } from '@/types'
import { CalendarDays, Clock, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type TabValue = 'upcoming' | 'today' | 'completed' | 'cancelled'

export default function AppointmentsPage() {
  const { user } = useAuthStore()
  const { appointments, setAppointments, updateAppointment, removeAppointment } = useAppointmentStore()
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const doctorId = user?.id || ''

  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) return
      try {
        const data = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        setAppointments(data)
      } catch (error) {
        toast.error('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [doctorId, setAppointments])

  const handleAction = useCallback(async (id: string, status: Appointment['status']) => {
    setActionLoading(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('appointment_id', id)
      if (error) throw error
      updateAppointment(id, { status })
      toast.success(`Appointment ${status} successfully`)
    } catch {
      toast.error('Failed to update appointment')
    } finally {
      setActionLoading(null)
    }
  }, [updateAppointment])

  const today = new Date().toISOString().split('T')[0]

  const filterTabs: Record<TabValue, (a: Appointment) => boolean> = {
    upcoming: (a) => a.appointment_date > today && !['completed', 'cancelled', 'rejected'].includes(a.status),
    today: (a) => a.appointment_date === today,
    completed: (a) => a.status === 'completed',
    cancelled: (a) => ['cancelled', 'rejected'].includes(a.status),
  }

  const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
    pending: 'warning', confirmed: 'default', completed: 'success', cancelled: 'destructive', rejected: 'destructive',
    rescheduled: 'secondary',
  }

  const typeIcons = {
    video: <CalendarDays className="h-3.5 w-3.5" />,
    audio: <Clock className="h-3.5 w-3.5" />,
    chat: <Clock className="h-3.5 w-3.5" />,
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
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
        <p className="text-muted-foreground">Manage your patient appointments</p>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="w-full sm:w-auto flex-nowrap overflow-x-auto">
          <TabsTrigger value="today">Today ({appointments.filter(filterTabs.today).length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({appointments.filter(filterTabs.upcoming).length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({appointments.filter(filterTabs.completed).length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({appointments.filter(filterTabs.cancelled).length})</TabsTrigger>
        </TabsList>

        {(Object.keys(filterTabs) as TabValue[]).map((key) => (
          <TabsContent key={key} value={key}>
            {isMobile ? (
              <div className="space-y-3">
                {appointments.filter(filterTabs[key]).length === 0 && (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      No {key} appointments
                    </CardContent>
                  </Card>
                )}
                {appointments.filter(filterTabs[key]).map((apt) => (
                  <AppointmentCard
                    key={apt.appointment_id}
                    appointment={apt}
                    onAccept={(id) => handleAction(id, 'confirmed')}
                    onReject={(id) => handleAction(id, 'rejected')}
                    onComplete={(id) => handleAction(id, 'completed')}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.filter(filterTabs[key]).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            No {key} appointments
                          </TableCell>
                        </TableRow>
                      )}
                      {appointments.filter(filterTabs[key]).map((apt) => (
                        <TableRow key={apt.appointment_id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  {getInitials(apt.patient_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{apt.patient_name}</p>
                                <p className="text-xs text-muted-foreground">{apt.symptoms}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(apt.appointment_date, 'MMM dd, yyyy')}</TableCell>
                          <TableCell className="text-sm">{formatTime(apt.appointment_time)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              {typeIcons[apt.consultation_type]}
                              {apt.consultation_type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant[apt.status] || 'default'}>{apt.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {apt.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => handleAction(apt.appointment_id, 'confirmed')}
                                    disabled={actionLoading === apt.appointment_id}
                                  >
                                    {actionLoading === apt.appointment_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleAction(apt.appointment_id, 'rejected')}
                                    disabled={actionLoading === apt.appointment_id}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {apt.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => handleAction(apt.appointment_id, 'completed')}
                                  disabled={actionLoading === apt.appointment_id}
                                >
                                  {actionLoading === apt.appointment_id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
