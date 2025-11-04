import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Trigger the scrape/all endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/scrape/all`, {
      method: 'POST',
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Cron job executed',
      ...data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
