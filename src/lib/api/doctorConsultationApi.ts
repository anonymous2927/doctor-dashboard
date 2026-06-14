import { createClient } from '@/lib/supabase/client'
import type {
  Appointment,
  Doctor,
  Earning,
  Prescription,
  Slot,
} from '@/types'

export class DoctorConsultationApi {
  private static getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${process.env.CARENIUM_API_KEY}`,
      'Content-Type': 'application/json',
    }
  }

  static async careniumFetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = process.env.CARENIUM_API_URL || 'https://api.carenium.com'
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    })
    if (!res.ok) {
      throw new Error(`Carenium API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  static async startConsultation(appointmentId: string): Promise<{ roomId: string; token: string }> {
    return this.careniumFetch(`/consultations/start`, {
      method: 'POST',
      body: JSON.stringify({ appointmentId }),
    })
  }

  static async endConsultation(roomId: string): Promise<void> {
    await this.careniumFetch(`/consultations/${roomId}/end`, {
      method: 'POST',
    })
  }

  static async getConsultationHistory(doctorId: string): Promise<any[]> {
    return this.careniumFetch(`/consultations/doctor/${doctorId}`)
  }

  static async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: false })
    if (error) throw new Error(error.message)
    return data as Appointment[]
  }

  static async getDoctorsByCategory(): Promise<
    { category: string; doctors: Doctor[] }[]
  > {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('specialization')
    if (error) throw new Error(error.message)
    const doctors = data as Doctor[]
    const grouped: Record<string, Doctor[]> = {}
    for (const doctor of doctors) {
      const category = doctor.specialization
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(doctor)
    }
    return Object.entries(grouped).map(([category, doctors]) => ({
      category,
      doctors,
    }))
  }

  static async getDoctorProfile(doctorId: string): Promise<Doctor> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', doctorId)
      .single()
    if (error) throw new Error(error.message)
    return data as Doctor
  }

  static async updateAvailability(
    doctorId: string,
    slots: Partial<Slot>[]
  ): Promise<void> {
    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('slots')
      .delete()
      .eq('doctor_id', doctorId)
    if (deleteError) throw new Error(deleteError.message)
    if (slots.length > 0) {
      const slotsWithDoctor = slots.map((slot) => ({
        ...slot,
        doctor_id: doctorId,
      }))
      const { error: insertError } = await supabase
        .from('slots')
        .insert(slotsWithDoctor)
      if (insertError) throw new Error(insertError.message)
    }
  }

  static async getEarnings(doctorId: string): Promise<Earning[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as Earning[]
  }

  static async createPrescription(
    data: Partial<Prescription>
  ): Promise<Prescription> {
    const supabase = createClient()
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .insert([data])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return prescription as Prescription
  }
}
