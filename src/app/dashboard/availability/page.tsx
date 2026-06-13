'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { DoctorConsultationApi } from '@/lib/api/doctorConsultationApi'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Slot } from '@/types'
import { Plus, Trash2, Save, Loader2, CalendarX } from 'lucide-react'
import { toast } from 'sonner'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const SLOT_TYPES = [
  { value: 'morning', label: 'Morning (6AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
  { value: 'evening', label: 'Evening (5PM - 10PM)' },
]

interface DaySlot {
  day: string
  start_time: string
  end_time: string
  slot_duration: number
  enabled: boolean
}

export default function AvailabilityPage() {
  const { user } = useAuthStore()
  const doctorId = user?.id || ''
  const [slots, setSlots] = useState<DaySlot[]>([])
  const [blockDates, setBlockDates] = useState<string[]>([])
  const [newBlockDate, setNewBlockDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchSlots() {
      if (!doctorId) { setLoading(false); return }
      try {
        const appointments = await DoctorConsultationApi.getDoctorAppointments(doctorId)
        const supabase = createClient()
        const { data: slotData } = await supabase
          .from('slots')
          .select('*')
          .eq('doctor_id', doctorId)
        const existingSlots = (slotData || []) as Slot[]

        const today = new Date().toISOString().split('T')[0]
        const blocks = existingSlots
          .filter((s) => s.status === 'blocked' && s.date >= today)
          .map((s) => s.date)
        setBlockDates([...new Set(blocks)])

        const daySlots: DaySlot[] = DAYS.map((day) => {
          const existing = existingSlots.find(
            (s) => s.date === day && s.status === 'available'
          )
          return {
            day,
            start_time: existing?.start_time || '09:00',
            end_time: existing?.end_time || '17:00',
            slot_duration: existing?.slot_duration || 30,
            enabled: !!existing,
          }
        })
        setSlots(daySlots)
      } catch {
        toast.error('Failed to load availability')
      } finally {
        setLoading(false)
      }
    }
    fetchSlots()
  }, [doctorId])

  const updateSlot = (index: number, updates: Partial<DaySlot>) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)))
  }

  const addBlockDate = () => {
    if (newBlockDate && !blockDates.includes(newBlockDate)) {
      setBlockDates([...blockDates, newBlockDate])
      setNewBlockDate('')
    }
  }

  const removeBlockDate = (date: string) => {
    setBlockDates(blockDates.filter((d) => d !== date))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      const slotInserts: Partial<Slot>[] = []
      for (const slot of slots) {
        if (slot.enabled) {
          slotInserts.push({
            doctor_id: doctorId,
            date: slot.day,
            start_time: slot.start_time,
            end_time: slot.end_time,
            slot_duration: slot.slot_duration || 30,
            status: 'available',
          })
        }
      }

      for (const date of blockDates) {
        slotInserts.push({
          doctor_id: doctorId,
          date,
          start_time: '00:00',
          end_time: '23:59',
          slot_duration: 0,
          status: 'blocked',
        })
      }

      await DoctorConsultationApi.updateAvailability(doctorId, slotInserts)
      toast.success('Availability updated successfully')
    } catch {
      toast.error('Failed to save availability')
    } finally {
      setSaving(false)
    }
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
          <h2 className="text-2xl font-bold tracking-tight">Availability</h2>
          <p className="text-muted-foreground">Manage your consultation slots</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {slots.map((slot, index) => (
            <div key={slot.day}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 sm:w-40">
                  <Switch
                    checked={slot.enabled}
                    onCheckedChange={(checked) => updateSlot(index, { enabled: checked })}
                  />
                  <span className="font-medium text-sm min-w-[80px]">{slot.day}</span>
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">From</span>
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateSlot(index, { start_time: e.target.value })}
                      disabled={!slot.enabled}
                      className="h-8 w-28"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">To</span>
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateSlot(index, { end_time: e.target.value })}
                      disabled={!slot.enabled}
                      className="h-8 w-28"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <Select
                      value={String(slot.slot_duration)}
                      onValueChange={(v) => updateSlot(index, { slot_duration: parseInt(v) })}
                      disabled={!slot.enabled}
                    >
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 45, 60].map((d) => (
                          <SelectItem key={d} value={String(d)}>{d} min</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Badge variant={slot.enabled ? 'confirmed' : 'secondary'} className="h-6">
                  {slot.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Block Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={newBlockDate}
              onChange={(e) => setNewBlockDate(e.target.value)}
              className="max-w-[200px]"
            />
            <Button variant="outline" size="sm" onClick={addBlockDate} disabled={!newBlockDate}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {blockDates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No blocked dates</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {blockDates.map((date) => (
                <Badge key={date} variant="destructive" className="gap-1 px-3 py-1.5">
                  <CalendarX className="h-3 w-3" />
                  {date}
                  <button onClick={() => removeBlockDate(date)} className="ml-1 hover:text-destructive-foreground">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
