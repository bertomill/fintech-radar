import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    let userContext = '';
    if (user) {
      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (preferences) {
        userContext = `
          Consider the user's context:
          - Occupation: ${preferences.occupation}
          - Industry: ${preferences.industry}
          - Interests: ${preferences.interests.join(', ')}
          
          Tailor your analysis to be particularly relevant for someone in this position,
          highlighting aspects that intersect with their industry and interests.
        `;
      }
    }

    const { query } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert fintech analyst providing insights about financial technology trends and news.
            ${userContext}
            Focus on providing actionable insights and industry implications.
            Be concise but thorough in your analysis.`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "gpt-4-turbo-preview",
    });

    return Response.json({ 
      content: completion.choices[0].message.content,
      personalized: !!userContext // indicate if response was personalized
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to analyze' }, { status: 500 });
  }
} 