import { create } from 'zustand'
import type { Appointment } from '@/types'

interface AppointmentState {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
  isLoading: boolean
  error: string | null
  setAppointments: (appointments: Appointment[]) => void
  setSelectedAppointment: (appointment: Appointment | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (
    appointmentId: string,
    updates: Partial<Appointment>
  ) => void
  removeAppointment: (appointmentId: string) => void
  clearAppointments: () => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
  setAppointments: (appointments) => set({ appointments }),
  setSelectedAppointment: (appointment) =>
    set({ selectedAppointment: appointment }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),
  updateAppointment: (appointmentId, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.appointment_id === appointmentId ? { ...a, ...updates } : a
      ),
      selectedAppointment:
        state.selectedAppointment?.appointment_id === appointmentId
          ? { ...state.selectedAppointment, ...updates }
          : state.selectedAppointment,
    })),
  removeAppointment: (appointmentId) =>
    set((state) => ({
      appointments: state.appointments.filter(
        (a) => a.appointment_id !== appointmentId
      ),
      selectedAppointment:
        state.selectedAppointment?.appointment_id === appointmentId
          ? null
          : state.selectedAppointment,
    })),
  clearAppointments: () => set({ appointments: [], selectedAppointment: null }),
}))
