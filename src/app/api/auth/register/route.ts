import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { full_name, email, mobile, specialization, qualification, experience, hospital, clinic_address, consultation_fee, password } = await request.json()

    if (!full_name || !email || !password || !specialization) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'doctor' } },
    })

    if (authError) {
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    }

    const { error: doctorError } = await supabase.from('doctors').insert({
      doctor_id: authData.user.id,
      full_name,
      email,
      mobile,
      specialization,
      qualification,
      experience,
      hospital,
      clinic_address,
      consultation_fee,
      verification_status: 'pending',
    })

    if (doctorError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ success: false, error: doctorError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { doctor_id: authData.user.id, message: 'Registration submitted. Awaiting approval.' },
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
