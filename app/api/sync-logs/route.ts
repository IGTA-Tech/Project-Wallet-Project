import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminPassword, getAdminPasswordFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  // Check admin authentication
  const password = getAdminPasswordFromHeaders(request.headers);
  if (!password || !checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ logs: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
