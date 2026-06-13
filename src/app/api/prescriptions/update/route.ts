import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { prescription_id, ...updates } = body

    if (!prescription_id) {
      return NextResponse.json({ success: false, error: 'prescription_id is required' }, { status: 400 })
    }

    const allowedFields = ['diagnosis', 'symptoms', 'medications', 'instructions', 'followup_date']
    const validUpdates: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        validUpdates[field] = updates[field]
      }
    }

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .update(validUpdates)
      .eq('prescription_id', prescription_id)
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
