import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const preferences = await req.json();
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        id: user.id,
        ...preferences
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
} 