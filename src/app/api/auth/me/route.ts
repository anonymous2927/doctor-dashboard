import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', user.id)
      .single()

    if (doctorError) {
      return NextResponse.json({ success: false, error: 'Doctor profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { user, doctor } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
