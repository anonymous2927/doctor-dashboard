'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useSearchParams, useRouter } from 'next/navigation'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import type { Appointment, Prescription, MedicationItem } from '@/types'
import { Plus, Trash2, Save, FileText, Download, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

const emptyMedication: MedicationItem = { name: '', dosage: '', duration: '', frequency: '', instructions: '' }

function PrescriptionsInner() {
  const { user } = useAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const doctorId = user?.id || ''
  const prefillPatient = searchParams.get('patient') || ''
  const prefillAppointment = searchParams.get('appointment') || ''

  const [patients, setPatients] = useState<{ id: string; name: string }[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedPatient, setSelectedPatient] = useState(prefillPatient)
  const [selectedAppointment, setSelectedAppointment] = useState(prefillAppointment)
  const [diagnosis, setDiagnosis] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [medications, setMedications] = useState<MedicationItem[]>([{ ...emptyMedication }])
  const [testsRecommended, setTestsRecommended] = useState('')
  const [followupDate, setFollowupDate] = useState('')
  const [showForm, setShowForm] = useState(!!prefillPatient)

  useEffect(() => {
    async function fetchData() {
      if (!doctorId) return
      try {
        const data = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        setAppointments(data)

        const uniquePatients = new Map<string, string>()
        data.forEach((a) => {
          if (!uniquePatients.has(a.patient_id)) {
            uniquePatients.set(a.patient_id, a.patient_name)
          }
        })
        setPatients(Array.from(uniquePatients).map(([id, name]) => ({ id, name })))

        const supabase = createClient()
        const { data: rxData } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('doctor_id', doctorId)
          .order('created_at', { ascending: false })
        setPrescriptions((rxData || []) as Prescription[])
      } catch {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [doctorId])

  const updateMedication = (index: number, field: keyof MedicationItem, value: string) => {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)))
  }

  const addMedication = () => setMedications((prev) => [...prev, { ...emptyMedication }])
  const removeMedication = (index: number) => {
    if (medications.length > 1) setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (!selectedPatient || !diagnosis) {
      toast.error('Please select a patient and enter diagnosis')
      return
    }
    setSaving(true)
    try {
      const prescription = await DoctorConsultationApi.createPrescription({
        doctor_id: doctorId,
        patient_id: selectedPatient,
        appointment_id: selectedAppointment || undefined,
        diagnosis,
        symptoms,
        medications: medications.filter((m) => m.name),
        tests_recommended: testsRecommended,
        followup_date: followupDate || null,
      })
      setPrescriptions((prev) => [prescription, ...prev])
      toast.success('Prescription created successfully')
      setShowForm(false)
      resetForm()
    } catch {
      toast.error('Failed to create prescription')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setSelectedPatient('')
    setSelectedAppointment('')
    setDiagnosis('')
    setSymptoms('')
    setMedications([{ ...emptyMedication }])
    setTestsRecommended('')
    setFollowupDate('')
  }

  const handleDownloadPDF = (rx: Prescription) => {
    toast.info('PDF download will be available soon')
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">Create and manage patient prescriptions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> New Prescription
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Patient *</label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Appointment (optional)</label>
                <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
                  <SelectTrigger><SelectValue placeholder="Select appointment" /></SelectTrigger>
                  <SelectContent>
                    {appointments.filter((a) => !selectedPatient || a.patient_id === selectedPatient).map((a) => (
                      <SelectItem key={a.appointment_id} value={a.appointment_id}>
                        {formatDate(a.appointment_date, 'MMM dd')} - {a.patient_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium">Diagnosis *</label>
                <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium">Symptoms</label>
                <Textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Enter symptoms" rows={2} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Medications</label>
                <Button variant="outline" size="sm" onClick={addMedication}>
                  <Plus className="h-3 w-3 mr-1" /> Add Row
                </Button>
              </div>
              {medications.map((med, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-3 rounded-lg border bg-muted/30">
                  <div className="flex-1 min-w-[120px]">
                    <label className="text-xs text-muted-foreground">Name</label>
                    <Input value={med.name} onChange={(e) => updateMedication(index, 'name', e.target.value)} placeholder="Medicine name" className="h-8" />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-muted-foreground">Dosage</label>
                    <Input value={med.dosage} onChange={(e) => updateMedication(index, 'dosage', e.target.value)} placeholder="e.g. 500mg" className="h-8" />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-muted-foreground">Duration</label>
                    <Input value={med.duration} onChange={(e) => updateMedication(index, 'duration', e.target.value)} placeholder="e.g. 5 days" className="h-8" />
                  </div>
                  <div className="w-28">
                    <label className="text-xs text-muted-foreground">Frequency</label>
                    <Input value={med.frequency} onChange={(e) => updateMedication(index, 'frequency', e.target.value)} placeholder="e.g. 1-0-1" className="h-8" />
                  </div>
                  <div className="hidden sm:block flex-1 min-w-[120px]">
                    <label className="text-xs text-muted-foreground">Instructions</label>
                    <Input value={med.instructions} onChange={(e) => updateMedication(index, 'instructions', e.target.value)} placeholder="e.g. After food" className="h-8" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeMedication(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Tests Recommended</label>
                <Textarea value={testsRecommended} onChange={(e) => setTestsRecommended(e.target.value)} placeholder="Enter tests" rows={2} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Follow-up Date</label>
                <Input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Create Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Created Prescriptions ({prescriptions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Medications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No prescriptions created yet
                  </TableCell>
                </TableRow>
              )}
              {prescriptions.map((rx) => (
                <TableRow key={rx.prescription_id}>
                  <TableCell>
                    <span className="font-medium text-sm">{rx.patient_id.slice(0, 8)}</span>
                  </TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{rx.diagnosis}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{formatDate(rx.created_at, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {rx.medications?.slice(0, 2).map((m, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{m.name}</Badge>
                      ))}
                      {rx.medications?.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{rx.medications.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(rx)}>
                      <Download className="h-4 w-4" />
                    </Button>
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

export default function PrescriptionsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <PrescriptionsInner />
    </Suspense>
  )
}
