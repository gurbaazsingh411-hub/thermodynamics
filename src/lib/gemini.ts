// Gemini API utility for ThermoBot chatbot
const GEMINI_API_KEY = 'AIzaSyDMTMWvbtBf8HotNYQoTpuP7XefSmVNSxw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
- Format responses with markdown for better readability`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function sendMessageToGemini(
    message: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        // Build the conversation with system prompt
        const contents = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Hello! I\'m ThermoBot, your virtual assistant for engineering concepts. How can I help you today? Whether it\'s thermodynamics, fluid mechanics, heat transfer, or any other engineering topic, I\'m here to help!' }]
            },
            ...conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error('Unexpected response format');
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment!';
    }
}
