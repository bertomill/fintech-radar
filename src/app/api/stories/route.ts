import { NextResponse } from 'next/server';

const SOURCES = [
  'bloomberg.com',
  'reuters.com',
  'ft.com',
  'wsj.com',
  'cnbc.com'
].join(',');

export async function GET() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?` + 
      new URLSearchParams({
        category: 'business',
        language: 'en',
        pageSize: '10',
        domains: SOURCES,
        apiKey: process.env.NEWS_API_KEY || '',
      })
    );

    if (!response.ok) {
      throw new Error('News API error');
    }

    const data = await response.json();
    return NextResponse.json(data.articles);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
} 