import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert Election Guide AI Assistant for Indian elections. Your role is to help citizens understand:
- Voter registration process and requirements
- Documents needed to vote (Voter ID, Aadhaar, DigiLocker, etc.)
- How to find polling booths and check eligibility
- Election timeline and key dates
- Voting day procedures and rights

Guidelines:
- Respond in simple, clear English.
- Use bullet points for steps.
- Be encouraging and neutral.
- Keep responses concise.
- If the question is not about elections, politely redirect.
- Always end with a helpful tip.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ response: "AI Key is missing. Please check your .env.local file." });
    }

    // Try a few model variations in case one is restricted or missing
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
    let response = '';
    let lastError = '';

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        });

        // Simple direct prompt for max reliability
        const prompt = `${SYSTEM_PROMPT}\n\nContext: ${JSON.stringify(messages.slice(-5))}\n\nUser Question: ${userMessage}\n\nResponse:`;
        
        const result = await model.generateContent(prompt);
        response = result.response.text();
        
        if (response) break; // Success!
      } catch (err: any) {
        lastError = err.message;
        console.warn(`Model ${modelName} failed:`, lastError);
        continue; // Try next model
      }
    }

    if (!response) {
      throw new Error(lastError || 'All models failed to respond');
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Gemini API Ultimate Error:', error);
    
    let friendlyMessage = "I'm having trouble connecting to my brain right now! 🧠";
    
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
      friendlyMessage = "The API key provided is invalid or unauthorized. Please check your AI Studio settings.";
    } else if (error.message?.includes('429')) {
      friendlyMessage = "I've hit a usage limit. Please wait a moment before asking again.";
    } else if (error.message?.includes('404')) {
      friendlyMessage = "The AI model is currently unavailable in your region. Please try again later.";
    }

    return NextResponse.json({ 
      response: `${friendlyMessage} However, as an election guide, I can remind you that you can always check your voter status on the official NVSP portal.`,
      debugError: error.message
    });
  }
}
