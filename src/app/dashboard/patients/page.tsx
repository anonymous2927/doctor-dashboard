'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatTime, getInitials } from '@/lib/utils/format'
import type { Appointment, PatientRecord } from '@/types'
import { Search, Users, CalendarDays, FileText, Loader2, X, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface PatientSummary {
  patient_id: string
  name: string
  age: number
  gender: string
  symptoms: string[]
  lastVisit: string
  status: 'active' | 'inactive'
  appointments: Appointment[]
  records: PatientRecord[]
}

export default function PatientsPage() {
  const { user } = useAuthStore()
  const doctorId = user?.id || ''
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null)

  useEffect(() => {
    async function fetchPatients() {
      if (!doctorId) return
      try {
        const appointments = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        const supabase = createClient()

        const patientMap = new Map<string, PatientSummary>()
        for (const apt of appointments) {
          if (!patientMap.has(apt.patient_id)) {
            let records: PatientRecord[] = []
            try {
              const { data: recs } = await supabase
                .from('patient_records')
                .select('*')
                .eq('patient_id', apt.patient_id)
                .eq('doctor_id', doctorId)
              records = (recs || []) as PatientRecord[]
            } catch { /* ignore */ }

            const patientApts = appointments.filter((a) => a.patient_id === apt.patient_id)
            const lastVisit = patientApts.reduce((latest, a) => {
              return a.appointment_date > latest ? a.appointment_date : latest
            }, '')

            patientMap.set(apt.patient_id, {
              patient_id: apt.patient_id,
              name: apt.patient_name,
              age: apt.patient_age,
              gender: apt.patient_gender,
              symptoms: [...new Set(patientApts.map((a) => a.symptoms).filter(Boolean))],
              lastVisit,
              status: patientApts.some((a) => a.status === 'confirmed' || a.status === 'pending') ? 'active' : 'inactive',
              appointments: patientApts,
              records,
            })
          }
        }
        setPatients(Array.from(patientMap.values()))
      } catch {
        toast.error('Failed to load patients')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [doctorId])

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(null)}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{selectedPatient.name}</h2>
            <p className="text-muted-foreground">
              {selectedPatient.age} yrs | {selectedPatient.gender}
            </p>
          </div>
        </div>

        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {selectedPatient.records.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No medical history available
                </CardContent>
              </Card>
            ) : (
              selectedPatient.records.map((rec) => (
                <Card key={rec.record_id}>
                  <CardContent className="p-4 space-y-2">
                    {rec.medical_history && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Medical History</p>
                        <p className="text-sm">{rec.medical_history}</p>
                      </div>
                    )}
                    {rec.allergies && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                        <p className="text-sm">{rec.allergies}</p>
                      </div>
                    )}
                    {rec.current_medications && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Medications</p>
                        <p className="text-sm">{rec.current_medications}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
            {selectedPatient.symptoms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reported Symptoms</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {selectedPatient.symptoms.map((s, i) => (
                    <Badge key={i} variant="secondary">{s}</Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports">
            {selectedPatient.records.filter((r) => r.report_url).length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No reports available
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedPatient.records.filter((r) => r.report_url).map((rec) => (
                  <Card key={rec.record_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">Medical Report</p>
                          <p className="text-xs text-muted-foreground">ID: {rec.record_id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={rec.report_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPatient.appointments.map((apt) => (
                      <TableRow key={apt.appointment_id}>
                        <TableCell>{formatDate(apt.appointment_date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{formatTime(apt.appointment_time)}</TableCell>
                        <TableCell className="capitalize">{apt.consultation_type}</TableCell>
                        <TableCell>
                          <Badge variant={
                            apt.status === 'completed' ? 'success' :
                            apt.status === 'confirmed' ? 'default' :
                            apt.status === 'pending' ? 'warning' :
                            apt.status === 'cancelled' ? 'destructive' : 'destructive'
                          }>{apt.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
        <p className="text-muted-foreground">View and manage your patient records</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients by name or ID..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No patients found
          </div>
        )}
        {filtered.map((patient) => (
          <Card
            key={patient.patient_id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800"
            onClick={() => setSelectedPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 border-2 border-emerald-100 dark:border-emerald-900/30">
                  <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{patient.name}</h3>
                    <Badge variant={patient.status === 'active' ? 'success' : 'secondary'}>
                      {patient.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{patient.age} yrs | {patient.gender}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {patient.symptoms.slice(0, 2).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                    {patient.symptoms.length > 2 && (
                      <Badge variant="outline" className="text-xs">+{patient.symptoms.length - 2}</Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    Last visit: {patient.lastVisit ? formatDate(patient.lastVisit, 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
