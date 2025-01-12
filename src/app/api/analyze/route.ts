import { openai } from '@/lib/ai/config';
import { NextResponse } from 'next/server';
import { fetchLatestFintechNews } from '@/lib/services/news';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // Fetch latest news
    const latestNews = await fetchLatestFintechNews();

    // Format recent news for context
    const newsContext = latestNews.length > 0
      ? latestNews
          .map(article => `${article.title} (${article.publishedAt})`)
          .join('\n')
      : 'No recent news available.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a specialized fintech analyst AI with deep expertise in fintech analysis.
            
            Latest News Context:
            ${newsContext}

            Important guidelines:
            - Base your analysis on the provided real-time news
            - Reference specific news events in your analysis
            - Highlight immediate market impacts and trends
            - Include citations to specific news articles when relevant
            
            Format your response with:
            ### [Topic Number]. [Topic Title]
            Analysis with references to current news`
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ 
      analysis: completion.choices[0].message.content,
      sources: latestNews
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
} 