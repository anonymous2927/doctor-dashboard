import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjvdzmpkyqbqmstzwwqz.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdmR6bXBreXFicW1zdHp3d3F6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTM3MzY3NCwiZXhwIjoyMDk2OTQ5Njc0fQ.z9VJmqmnRMQqa1IRtgX-87vyYUpUjHAMnjGZ18Yl504';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const queries = [
  `CREATE TABLE IF NOT EXISTS doctors (
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
  )`,
  `CREATE TABLE IF NOT EXISTS doctor_availability (
    availability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER NOT NULL DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'available'
  )`,
  `CREATE TABLE IF NOT EXISTS slots (
    slot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked'))
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
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
  )`,
  `CREATE TABLE IF NOT EXISTS prescriptions (
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
  )`,
  `CREATE TABLE IF NOT EXISTS patient_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    report_url TEXT,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS earnings (
    earning_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

async function tryRpc(query) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query_text: query });
    if (error) throw error;
    return { method: 'rpc', data };
  } catch {
    return null;
  }
}

async function tryRestApi(query) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'params=single-object',
      },
      body: JSON.stringify({ query }),
    });
    if (res.ok) return { method: 'rest', data: await res.json() };
    return null;
  } catch {
    return null;
  }
}

async function runMigration() {
  console.log('Running database migration...\n');

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';

    let result = await tryRpc(query);
    if (!result) result = await tryRestApi(query);

    if (result) {
      console.log(`✓ Created table: ${tableName} (via ${result.method})`);
    } else {
      console.log(`✗ Could not create table: ${tableName} - please run SQL manually`);
      console.log(`  SQL: ${query.slice(0, 80)}...\n`);
    }
  }

  console.log('\nMigration complete!');
  console.log('\nIf some tables failed, run this SQL in Supabase SQL Editor:');
  console.log('  https://supabase.com/dashboard/project/wjvdzmpkyqbqmstzwwqz/sql/new');
}

runMigration().catch(console.error);
