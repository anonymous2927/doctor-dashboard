import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const { slot_id } = await request.json()

    if (!slot_id) {
      return NextResponse.json({ success: false, error: 'slot_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('doctor_availability')
      .update({ status: 'inactive' })
      .eq('availability_id', slot_id)
      .eq('doctor_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { message: 'Slot deactivated successfully' } })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
