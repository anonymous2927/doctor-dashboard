import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', user.id)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (dateFrom) {
      query = query.gte('appointment_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('appointment_date', dateTo)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
