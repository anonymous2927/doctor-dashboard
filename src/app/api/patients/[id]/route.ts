import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('patient_id', id)
      .order('appointment_date', { ascending: false })

    if (appointmentsError) {
      return NextResponse.json({ success: false, error: appointmentsError.message }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 })
    }

    const { data: prescriptions } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('patient_id', id)
      .order('created_at', { ascending: false })

    const { data: records } = await supabase
      .from('patient_records')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('patient_id', id)
      .order('created_at', { ascending: false })

    const patient = appointments[0]

    return NextResponse.json({
      success: true,
      data: {
        patient_id: patient.patient_id,
        patient_name: patient.patient_name,
        patient_age: patient.patient_age,
        patient_gender: patient.patient_gender,
        appointments: appointments || [],
        prescriptions: prescriptions || [],
        medical_history: records || [],
        total_visits: appointments.length,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
