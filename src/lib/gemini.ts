// OpenRouter API utility for ThermoBot chatbot
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are ThermoBot, a friendly and knowledgeable AI assistant specialized in engineering concepts, particularly:
- Thermodynamics (laws, cycles, heat engines, refrigeration)
- Heat Transfer (conduction, convection, radiation)
- Fluid Mechanics (Bernoulli, pipe flow, Reynolds number)
- Engineering Mechanics (forces, motion, equilibrium)
- Renewable Energy (solar, wind, sustainability)
- Engineering Mathematics (calculus, differential equations)

Guidelines:
- Be concise but thorough in explanations
- Use relevant formulas and equations when helpful
- Provide practical examples when possible
- If asked about something outside engineering, politely redirect to engineering topics
- Use friendly, encouraging language to support learning
- Keep responses under 300 words for readability`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function sendMessageToGemini(
    message: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        // Build messages array for OpenRouter (OpenAI-compatible format)
        const messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        console.log('Sending request to OpenRouter API...');

        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
                'X-Title': 'ThermoBot - Engineering Assistant'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('OpenRouter response:', data);

        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        }

        throw new Error('Unexpected response format: ' + JSON.stringify(data));
    } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        if (error instanceof Error) {
            return `I'm having trouble connecting: ${error.message}. Please check the browser console for details.`;
        }
        return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment!';
    }
}
