import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateScreenshot } from '@/lib/screenshot';
import { checkAdminPassword, getAdminPasswordFromHeaders } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const password = getAdminPasswordFromHeaders(request.headers);
  if (!password || !checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get project
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Generate new screenshot
    const url = project.primary_url || project.netlify_url || project.vercel_url;
    if (!url) {
      return NextResponse.json(
        { error: 'No URL available for screenshot' },
        { status: 400 }
      );
    }

    const screenshotUrl = await generateScreenshot(url);

    // Update project
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        screenshot_url: screenshotUrl,
        screenshot_updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      screenshot_url: screenshotUrl,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
