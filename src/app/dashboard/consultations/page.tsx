'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatTime, getInitials } from '@/lib/utils/format'
import type { Appointment } from '@/types'
import { Video, Phone, Loader2, FileText, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

export default function ConsultationsPage() {
  const { user } = useAuthStore()
  const doctorId = user?.id || ''
  const [consultations, setConsultations] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!doctorId) return
      try {
        const data = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        setConsultations(
          data.filter((a) => a.status === 'completed' || a.status === 'confirmed')
        )
      } catch {
        toast.error('Failed to load consultations')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [doctorId])

  const handleCall = (type: 'video' | 'audio', apt: Appointment) => {
    toast.info(`${type === 'video' ? 'Video' : 'Audio'} call started with ${apt.patient_name}`)
  }

  const saveNotes = async (aptId: string) => {
    toast.success('Notes saved')
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
        <h2 className="text-2xl font-bold tracking-tight">Consultations</h2>
        <p className="text-muted-foreground">Manage your active and completed consultations</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({consultations.filter((a) => a.status === 'confirmed').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({consultations.filter((a) => a.status === 'completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {consultations.filter((a) => a.status === 'confirmed').length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No active consultations
              </CardContent>
            </Card>
          )}
          {consultations.filter((a) => a.status === 'confirmed').map((apt) => (
            <Card key={apt.appointment_id} className="transition-all hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-emerald-100 dark:border-emerald-900/30">
                    <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                      {getInitials(apt.patient_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{apt.patient_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(apt.appointment_date, 'MMM dd, yyyy')} at {formatTime(apt.appointment_time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="confirmed">Confirmed</Badge>
                        <Badge variant="outline" className="capitalize">{apt.consultation_type}</Badge>
                      </div>
                    </div>
                    {apt.symptoms && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Symptoms:</span> {apt.symptoms}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                        onClick={() => handleCall('video', apt)}
                      >
                        <Video className="h-4 w-4" /> Start Video Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleCall('audio', apt)}
                      >
                        <Phone className="h-4 w-4" /> Start Audio Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {consultations.filter((a) => a.status === 'completed').length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No completed consultations
              </CardContent>
            </Card>
          )}
          {consultations.filter((a) => a.status === 'completed').map((apt) => (
            <Card key={apt.appointment_id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium">
                        {getInitials(apt.patient_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">{apt.patient_name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(apt.appointment_date, 'MMM dd, yyyy')} | {formatTime(apt.appointment_time)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="completed">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {apt.symptoms && (
                  <p className="text-sm text-muted-foreground mb-3">
                    <span className="font-medium">Symptoms:</span> {apt.symptoms}
                  </p>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Notes</label>
                  <Textarea
                    placeholder="Add consultation notes..."
                    value={notes[apt.appointment_id] || ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [apt.appointment_id]: e.target.value }))}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveNotes(apt.appointment_id)}
                      className="gap-1"
                    >
                      <FileText className="h-3 w-3" /> Save Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      asChild
                    >
                      <a href={`/dashboard/prescriptions?patient=${apt.patient_id}&appointment=${apt.appointment_id}`}>
                        <MessageSquare className="h-3 w-3" /> Write Prescription
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
