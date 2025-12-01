/**
 * Vercel serverless function to proxy requests to OpenRouter API
 * This keeps the API key secure on the server side
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from server-side environment variable
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('VITE_OPENROUTER_API_KEY is not set in Vercel environment variables');
    return res.status(500).json({ 
      error: 'OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in Vercel environment variables.' 
    });
  }

  try {
    // Forward the request to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.referer || req.headers.origin || 'https://insightstreamstudio.vercel.app',
        'X-Title': 'InsightStream Studio',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'OpenRouter API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to OpenRouter:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
