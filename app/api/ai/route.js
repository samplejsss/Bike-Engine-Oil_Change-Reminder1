import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt, contextObj, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing Gemini API Key." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const dataContext = JSON.stringify(contextObj, null, 2);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are BikeCare AI, an expert, 100% accurate motorcycle and scooter mechanic. 
You are embedded inside a bike tracking application. 
The user's current data is as follows:
${dataContext}

Follow these rules:
1. Always be helpful, concise, and accurate regarding motorcycle mechanical issues, engine oil, and efficiency.
2. If the user asks for analysis of their data, reference the data above dynamically. 
3. If they are close to or over their oil change limit, warmly remind them.
4. Format your responses using clean Markdown.
5. If you do not have enough data to precisely answer an efficiency question, explain what data is missing from the app (e.g., fuel litrage is not logged so explicit mileage can't be calculated, but averages can be guessed based on expenses).`
    });

    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    return Response.json({ response: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
