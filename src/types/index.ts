export interface Doctor {
  doctor_id: string
  full_name: string
  email: string
  mobile: string
  specialization: string
  qualification: string
  experience: number
  hospital: string
  clinic_address: string
  consultation_fee: number
  rating: number
  profile_image: string
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected'
  created_at: string
}

export interface DoctorAvailability {
  availability_id: string
  doctor_id: string
  day: string
  start_time: string
  end_time: string
  slot_duration: number
  status: string
}

export interface AppointmentSlot {
  slot_id: string
  doctor_id: string
  date: string
  start_time: string
  end_time: string
  slot_status: 'available' | 'booked' | 'blocked'
}

export interface Appointment {
  appointment_id: string
  doctor_id: string
  patient_id: string
  patient_name: string
  patient_age: number
  patient_gender: string
  symptoms: string
  appointment_date: string
  appointment_time: string
  consultation_type: 'video' | 'audio' | 'chat'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'rescheduled'
  payment_status: 'pending' | 'completed' | 'refunded'
  created_at: string
}

export interface Prescription {
  prescription_id: string
  appointment_id: string
  doctor_id: string
  patient_id: string
  diagnosis: string
  symptoms: string
  medications: MedicationItem[]
  instructions: string
  followup_date: string
  created_at: string
}

export interface MedicationItem {
  name: string
  dosage: string
  duration: string
  frequency: string
  instructions: string
}

export interface PatientRecord {
  record_id: string
  patient_id: string
  doctor_id: string
  report_url: string
  medical_history: string
  allergies: string
  current_medications: string
}

export interface Earning {
  earning_id: string
  doctor_id: string
  appointment_id: string
  amount: number
  commission: number
  net_amount: number
  payment_status: string
  created_at: string
}

export interface Notification {
  notification_id: string
  doctor_id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export interface Slot {
  slot_id: string
  doctor_id: string
  date: string
  start_time: string
  end_time: string
  status: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  todayAppointments: number
  upcomingAppointments: number
  completedConsultations: number
  totalPatients: number
  revenueToday: number
  revenueThisMonth: number
  averageRating: number
  pendingFollowups: number
}
