import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminPassword, getAdminPasswordFromHeaders } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const password = getAdminPasswordFromHeaders(request.headers);

    if (!password || !checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ project: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
