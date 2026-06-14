-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  hospital TEXT,
  clinic_address TEXT,
  consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  profile_image TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doctor availability
CREATE TABLE IF NOT EXISTS doctor_availability (
  availability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'available'
);

-- Time slots
CREATE TABLE IF NOT EXISTS slots (
  slot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked'))
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  patient_id UUID,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  symptoms TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'rescheduled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  patient_id UUID,
  diagnosis TEXT,
  symptoms TEXT,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT,
  followup_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient records
CREATE TABLE IF NOT EXISTS patient_records (
  record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  report_url TEXT,
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Earnings
CREATE TABLE IF NOT EXISTS earnings (
  earning_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_slots_doctor_id ON slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_slots_date ON slots(date);
CREATE INDEX IF NOT EXISTS idx_earnings_doctor_id ON earnings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_doctor_id ON notifications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Doctors: users can read, insert, update their own profile
CREATE POLICY "Doctors can view own profile" ON doctors
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own profile" ON doctors
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own profile" ON doctors
  FOR UPDATE USING (doctor_id = auth.uid());

-- Appointments: doctors manage their own appointments
CREATE POLICY "Doctors can view own appointments" ON appointments
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own appointments" ON appointments
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own appointments" ON appointments
  FOR DELETE USING (doctor_id = auth.uid());

-- Slots: doctors manage their own slots
CREATE POLICY "Doctors can view own slots" ON slots
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own slots" ON slots
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own slots" ON slots
  FOR UPDATE USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own slots" ON slots
  FOR DELETE USING (doctor_id = auth.uid());

-- Availability: doctors manage their own
CREATE POLICY "Doctors can view own availability" ON doctor_availability
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can manage own availability" ON doctor_availability
  FOR ALL USING (doctor_id = auth.uid());

-- Prescriptions: doctors see their own
CREATE POLICY "Doctors can view own prescriptions" ON prescriptions
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own prescriptions" ON prescriptions
  FOR UPDATE USING (doctor_id = auth.uid());

-- Patient records: doctors manage their patients
CREATE POLICY "Doctors can view patient records" ON patient_records
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert patient records" ON patient_records
  FOR INSERT WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update patient records" ON patient_records
  FOR UPDATE USING (doctor_id = auth.uid());

-- Earnings: doctors see their own
CREATE POLICY "Doctors can view own earnings" ON earnings
  FOR SELECT USING (doctor_id = auth.uid());

-- Notifications: doctors see their own
CREATE POLICY "Doctors can view own notifications" ON notifications
  FOR SELECT USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own notifications" ON notifications
  FOR UPDATE USING (doctor_id = auth.uid());
