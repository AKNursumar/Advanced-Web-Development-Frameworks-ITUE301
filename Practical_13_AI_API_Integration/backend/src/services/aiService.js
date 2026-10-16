/**
 * AI Service for Auto-Generating Task Descriptions
 * Supports Google Gemini API (gemini-1.5-flash) and OpenAI API (gpt-4o-mini)
 * Implements strict graceful degradation, timeouts, and privacy data isolation.
 */

async function generateWithGemini(title, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are a productivity and task management assistant.
Write a concise, professional 2-3 sentence task description and action plan for this task title: "${title}".
Do not use markdown formatting or bullet points. Keep it clear, realistic, and actionable.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 150
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini API returned an empty response candidate');
    }

    return candidateText.trim();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function generateWithOpenAI(title, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const prompt = `Write a concise 2-3 sentence description and action plan for this task: "${title}". Plain text only.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.4
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API responded with status ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content;
    return description ? description.trim() : '';
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Main generator entry point with comprehensive graceful degradation
 */
async function generateTaskDescription(title) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;

  // 1. Graceful check: If API key is not configured, return safe fallback
  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes('your_')) {
    return {
      success: true,
      fallback: true,
      description: '',
      provider,
      message: `AI suggestion disabled: No valid ${provider.toUpperCase()}_API_KEY configured in backend .env. Manual entry remains available.`
    };
  }

  // 2. Perform live AI generation call
  try {
    let description = '';
    if (provider === 'openai') {
      description = await generateWithOpenAI(title, apiKey);
    } else {
      description = await generateWithGemini(title, apiKey);
    }

    return {
      success: true,
      fallback: false,
      description,
      provider,
      disclaimer: 'AI-generated suggestion. Please review and edit before saving.'
    };
  } catch (error) {
    // 3. Graceful degradation: catch network, quota, or key errors and keep app usable
    console.warn(`[AI Service Fallback Triggered] Provider ${provider} failed: ${error.message}`);
    return {
      success: true,
      fallback: true,
      description: '',
      provider,
      error: error.message,
      message: 'AI service temporarily unavailable or request timed out. Please enter description manually.'
    };
  }
}

module.exports = {
  generateTaskDescription
};
