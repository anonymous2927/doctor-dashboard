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
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    let query = supabase
      .from('earnings')
      .select('*')
      .eq('doctor_id', user.id)
      .order('created_at', { ascending: false })

    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const totalEarnings = (data || []).reduce((sum, e) => sum + (e.net_amount || e.amount || 0), 0)
    const totalCommission = (data || []).reduce((sum, e) => sum + (e.commission || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        earnings: data,
        summary: {
          totalEarnings,
          totalCommission,
          netEarnings: totalEarnings - totalCommission,
          totalTransactions: data?.length || 0,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
