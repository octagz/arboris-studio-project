import axios from 'axios';

// OpenRouter provides a unified API for multiple AI providers
// https://openrouter.ai/docs
const OPENROUTER_API_URL = '/api/openrouter/chat/completions';

function getApiKey() {
    return import.meta.env.VITE_OPENROUTER_API_KEY;
}

function getModel() {
    return import.meta.env.VITE_AI_MODEL || 'google/gemini-2.5-flash';
}

function isMockMode() {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true';
}

/**
 * Check if we're in development mode (local)
 * In dev, we use Vite proxy which requires API key in headers
 * In production, Vercel serverless function handles the API key
 */
function isDevelopment() {
    return import.meta.env.DEV || import.meta.env.MODE === 'development';
}

/**
 * Core function to call OpenRouter API
 * - In development: Uses Vite proxy with API key in headers
 * - In production: Uses Vercel serverless function (API key handled server-side)
 */
async function callAI(messages) {
    const model = getModel();
    const isDev = isDevelopment();

    console.log(`[aiService] Calling ${model} via OpenRouter... (${isDev ? 'dev' : 'prod'} mode)`);

    // Build headers - include API key only in development
    const headers = {
        'Content-Type': 'application/json',
    };

    if (isDev) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('VITE_OPENROUTER_API_KEY is not set. Required for local development.');
        }
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = window.location.origin;
    }

    const response = await axios.post(
        OPENROUTER_API_URL,
        { model, messages },
        { headers }
    );

    console.log('[aiService] Response received');
    return response.data;
}

/**
 * Parse JSON from API response content (handles markdown code blocks)
 */
function parseJsonResponse(content) {
    try {
        return JSON.parse(content);
    } catch {
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            return JSON.parse(arrayMatch[0]);
        }
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            return JSON.parse(objectMatch[0]);
        }
        throw new Error('Could not parse JSON from response');
    }
}

/**
 * Generate a summary for an interview transcript
 */
export async function generateSummary(transcript) {
    if (isMockMode()) {
        console.log('[aiService] MOCK MODE: generateSummary');
        return mockGenerateSummary();
    }

    const messages = [
        {
            role: 'system',
            content: 'You are an expert user researcher. Summarize the following interview transcript, highlighting key insights and pain points. Keep it concise.',
        },
        { role: 'user', content: transcript },
    ];

    const data = await callAI(messages);
    return data.choices[0].message.content;
}

/**
 * Extract themes from an interview transcript
 */
export async function extractThemes(transcript) {
    if (isMockMode()) {
        console.log('[aiService] MOCK MODE: extractThemes');
        return mockExtractThemes();
    }

    const messages = [
        {
            role: 'system',
            content: 'You are an expert user researcher. Extract the top 3-5 recurring themes from the following interview transcript. Return them as a JSON array of strings only, no other text.',
        },
        { role: 'user', content: transcript },
    ];

    const data = await callAI(messages);
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    return [];
}

/**
 * Analyze a transcript for insights
 */
export async function analyzeTranscript(transcript) {
    if (isMockMode()) {
        console.log('[aiService] MOCK MODE: analyzeTranscript');
        return mockAnalyze();
    }

    const messages = [
        {
            role: 'system',
            content: `You are an expert product researcher. Analyze interview transcripts and extract key insights.
Focus on: Pain points, User needs/desires, Feature requests, Sentiment, Strategic alignment.
Return a JSON object with a list of "insights". Each insight has: title, description, type (Pain Point/Need/Feature Request/Sentiment/Strategy), confidence (0-1).`,
        },
        { role: 'user', content: `Analyze this transcript:\n\n${transcript}` },
    ];

    const data = await callAI(messages);
    return parseJsonResponse(data.choices[0].message.content);
}

/**
 * Compose new insights with existing insights
 */
export async function composeInsights(newInsights, existingInsights) {
    if (isMockMode()) {
        console.log('[aiService] MOCK MODE: composeInsights');
        return { insights: [...existingInsights, ...newInsights] };
    }

    const messages = [
        {
            role: 'system',
            content: `You are a senior product strategist. Given NEW insights and EXISTING insights:
- Merge reinforcing insights and increase impact score
- Note conflicts between contradicting insights
- Add novel insights
Return the final list as a JSON object with "insights" array.`,
        },
        {
            role: 'user',
            content: `New Insights: ${JSON.stringify(newInsights)}\n\nExisting Insights: ${JSON.stringify(existingInsights)}`,
        },
    ];

    const data = await callAI(messages);
    return parseJsonResponse(data.choices[0].message.content);
}

/**
 * Validate hypotheses against interview transcripts
 */
export async function validateHypotheses(hypotheses, transcripts) {
    if (isMockMode()) {
        console.log('[aiService] MOCK MODE: validateHypotheses');
        return mockValidate(hypotheses);
    }

    console.log('[aiService] validateHypotheses called with', hypotheses.length, 'hypotheses and', transcripts.length, 'transcripts');

    const messages = [
        {
            role: 'system',
            content: `You are a rigorous product researcher. Given HYPOTHESES and INTERVIEW TRANSCRIPTS, find evidence that SUPPORTS or REFUTES each hypothesis.

Return a JSON array where each item has:
- "id": The hypothesis ID (number)
- "confidence": Number between 0 and 1
- "evidence": Array of objects with "quote" (string), "source" (string), and "type" ("supporting" or "refuting")

If no evidence found for a hypothesis, return an empty evidence array for it. Return only the JSON array, no other text.`,
        },
        {
            role: 'user',
            content: `Hypotheses: ${JSON.stringify(hypotheses)}\n\nTranscripts: ${JSON.stringify(transcripts)}`,
        },
    ];

    const data = await callAI(messages);
    return parseJsonResponse(data.choices[0].message.content);
}

// ============ Mock Functions ============

function mockGenerateSummary() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('This is a mock summary generated for the provided transcript. It highlights key pain points and opportunities mentioned by the interviewee.');
        }, 1000);
    });
}

function mockExtractThemes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(['Mock Theme 1', 'Mock Theme 2', 'Mock Theme 3']);
        }, 1000);
    });
}

function mockAnalyze() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                insights: [
                    { title: 'Mock Insight', description: 'This is mock data', type: 'Pain Point', confidence: 0.8 },
                ],
            });
        }, 1000);
    });
}

function mockValidate(hypotheses) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                hypotheses.map((h) => {
                    if (h.text.toLowerCase().includes('time consuming') || h.text.toLowerCase().includes('manual')) {
                        return {
                            id: h.id,
                            confidence: 0.95,
                            evidence: [
                                { quote: 'Teaching students to do customer discovery is hard because they get overwhelmed by the data...', source: 'Dr. Emily Chen', type: 'supporting' },
                                { quote: "I spend about 20% of my week just tagging interviews...", source: 'Sarah Miller', type: 'supporting' },
                            ],
                        };
                    }
                    return {
                        id: h.id,
                        confidence: 0.4,
                        evidence: [{ quote: "I haven't really seen that be a huge issue for us yet.", source: 'James Wilson', type: 'refuting' }],
                    };
                })
            );
        }, 1500);
    });
}
