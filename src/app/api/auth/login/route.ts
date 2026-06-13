import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      return NextResponse.json({ success: false, error: authError.message }, { status: 401 })
    }

    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', authData.user.id)
      .single()

    if (doctorError || !doctor) {
      await supabase.auth.signOut()
      return NextResponse.json({ success: false, error: 'Doctor profile not found' }, { status: 404 })
    }

    if (doctor.verification_status !== 'approved') {
      await supabase.auth.signOut()
      return NextResponse.json({ success: false, error: 'Account not yet approved. Please wait for verification.' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: { session: authData.session, doctor },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
