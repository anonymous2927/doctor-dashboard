import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('patient_id, patient_name, patient_age, patient_gender')
      .eq('doctor_id', user.id)
      .order('created_at', { ascending: false })

    if (appointmentsError) {
      return NextResponse.json({ success: false, error: appointmentsError.message }, { status: 500 })
    }

    const patientMap = new Map<string, Record<string, unknown>>()
    for (const app of appointments || []) {
      if (!patientMap.has(app.patient_id)) {
        patientMap.set(app.patient_id, {
          patient_id: app.patient_id,
          patient_name: app.patient_name,
          patient_age: app.patient_age,
          patient_gender: app.patient_gender,
          last_visit: app.appointment_date,
          total_visits: 1,
        })
      } else {
        const existing = patientMap.get(app.patient_id)!
        existing.total_visits = (existing.total_visits as number) + 1
      }
    }

    const patients = Array.from(patientMap.values())

    return NextResponse.json({ success: true, data: patients })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
