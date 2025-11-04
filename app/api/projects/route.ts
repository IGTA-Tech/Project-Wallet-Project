import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminPassword, getAdminPasswordFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get('public') === 'true';
  const status = searchParams.get('status');
  const stage = searchParams.get('stage');

  // Check if admin is authenticated
  const password = getAdminPasswordFromHeaders(request.headers);
  const isAdmin = password && checkAdminPassword(password);

  try {
    // Use admin client if authenticated, otherwise use public client
    const client = isAdmin ? supabaseAdmin : supabase;
    let query = client.from('projects').select('*');

    // If not admin and not explicitly requesting public, default to public only
    if (!isAdmin && publicOnly !== false) {
      query = query.eq('is_public', true);
    } else if (publicOnly) {
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
