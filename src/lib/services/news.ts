export async function fetchLatestFintechNews() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?` + 
      new URLSearchParams({
        q: '(fintech OR "financial technology" OR blockchain OR cryptocurrency OR "digital banking")',
        sortBy: 'publishedAt',
        from: new Date(Date.now() - 24*60*60*1000).toISOString(),
        apiKey: process.env.NEWS_API_KEY || '',
        language: 'en',
        pageSize: '5',
        domains: 'forbes.com,techcrunch.com,bloomberg.com,reuters.com,ft.com,cnbc.com'
      })
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from News API');
    }

    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return []; // Return empty array instead of undefined
  }
} 