import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    if (token) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: { session: data.session, user: data.user } })
    }

    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: { message: 'OTP sent to email' } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
