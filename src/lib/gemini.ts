// Gemini API utility for ThermoBot chatbot
const GEMINI_API_KEY = 'AIzaSyDMTMWvbtBf8HotNYQoTpuP7XefSmVNSxw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

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
        // Build the conversation with system prompt embedded in first user message
        const contents = [
            {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\nNow, please respond to this question: ${conversationHistory.length === 0 ? message : ''}` }]
            },
            {
                role: 'model',
                parts: [{ text: 'Hello! I\'m ThermoBot, your virtual assistant for engineering concepts. I\'m ready to help you with thermodynamics, fluid mechanics, heat transfer, and more!' }]
            }
        ];

        // Add conversation history
        for (const msg of conversationHistory) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }

        // Add current message if there's history (otherwise it's in the system prompt)
        if (conversationHistory.length > 0) {
            contents.push({
                role: 'user',
                parts: [{ text: message }]
            });
        }

        console.log('Sending request to Gemini API...');

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

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini response:', data);

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error('Unexpected response format: ' + JSON.stringify(data));
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            return `I'm having trouble connecting: ${error.message}. Please check the browser console for details.`;
        }
        return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment!';
    }
}

