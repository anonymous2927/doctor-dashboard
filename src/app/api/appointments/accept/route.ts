import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { appointment_id } = await request.json()

    if (!appointment_id) {
      return NextResponse.json({ success: false, error: 'appointment_id is required' }, { status: 400 })
    }

    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_id', appointment_id)
      .eq('doctor_id', user.id)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' })
      .eq('appointment_id', appointment_id)
      .eq('doctor_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
