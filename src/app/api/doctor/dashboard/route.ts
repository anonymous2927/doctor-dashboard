import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

    const [todayApps, upcomingApps, completedApps, totalPatientsResult, earningsToday, earningsMonth, ratingResult, followups] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', user.id).eq('appointment_date', today).neq('status', 'cancelled'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', user.id).gte('appointment_date', today).neq('status', 'completed').neq('status', 'cancelled').neq('status', 'rejected'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', user.id).eq('status', 'completed'),
      supabase.from('appointments').select('patient_id', { count: 'exact', head: true }).eq('doctor_id', user.id),
      supabase.from('earnings').select('amount').eq('doctor_id', user.id).eq('created_at', today),
      supabase.from('earnings').select('amount').eq('doctor_id', user.id).gte('created_at', startOfMonth),
      supabase.from('doctors').select('rating').eq('doctor_id', user.id).single(),
      supabase.from('prescriptions').select('*', { count: 'exact', head: true }).eq('doctor_id', user.id).gte('followup_date', today),
    ])

    const revenueToday = (earningsToday.data || []).reduce((sum, e) => sum + (e.amount || 0), 0)
    const revenueThisMonth = (earningsMonth.data || []).reduce((sum, e) => sum + (e.amount || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        todayAppointments: todayApps.count || 0,
        upcomingAppointments: upcomingApps.count || 0,
        completedConsultations: completedApps.count || 0,
        totalPatients: totalPatientsResult.count || 0,
        revenueToday,
        revenueThisMonth,
        averageRating: ratingResult.data?.rating || 0,
        pendingFollowups: followups.count || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
