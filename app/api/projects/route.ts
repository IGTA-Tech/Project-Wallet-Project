import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get('public') === 'true';
  const status = searchParams.get('status');
  const stage = searchParams.get('stage');

  try {
    let query = supabase.from('projects').select('*');

    if (publicOnly) {
      query = query.eq('is_public', true);
    }

    if (status) {
      query = query.eq('current_status', status);
    }

    if (stage) {
      query = query.eq('production_stage', stage);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
