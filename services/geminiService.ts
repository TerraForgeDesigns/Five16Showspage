
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateEventWriteup = async (eventName: string, eventLocation: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("<h3>Writeup Generation Unavailable</h3><p>The API key is not configured. Please add a writeup manually.</p>");
  }

  const prompt = `
    You are a professional event copywriter for an events company called "Five16 Events".
    Your tone is exciting, professional, and engaging.
    Generate a short, captivating event writeup for an event called "${eventName}" that took place at "${eventLocation}".
    The writeup should be 2-3 paragraphs long.
    Output the result as a simple HTML string containing only <h3> and <p> tags.
    The h3 tag should be a catchy title for the writeup.
    Do not include any other HTML tags like <html>, <body>, etc.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating event writeup:", error);
    return "<h3>Error Generating Content</h3><p>Could not generate writeup at this time. Please try again later or write one manually.</p>";
  }
};
