import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// This should ideally be stored in environment variables. 
// For demonstration and immediate use, we are checking this fixed key.
const API_KEY = process.env.PATIENT_APP_API_KEY || 'carenium_pt_live_9f8a8b7c6d5e4f3a2b1c';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'verified';
    const apiKey = req.headers.get('x-api-key');

    if (apiKey !== API_KEY) {
      return NextResponse.json({ error: 'Unauthorized. Invalid API Key.' }, { status: 401 });
    }

    let query = supabaseAdmin
      .from('doctors')
      .select('doctor_id, full_name, specialization, qualification, experience, hospital, clinic_address, consultation_fee, profile_image, rating');

    if (status) {
      query = query.eq('verification_status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching doctors:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Doctors API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
