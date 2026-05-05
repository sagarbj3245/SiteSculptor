import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

// ================= CHAT =================
export async function sendChatMessage(prompt) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

// ================= ENHANCE PROMPT =================
export async function enhancePrompt(prompt) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "Rewrite this user prompt to be clearer and more specific for an AI assistant.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 400,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

// ================= CODE GENERATION =================
export async function generateCode(prompt) {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that generates a minimal Vite React project. Return only valid JSON that matches the requested schema, with no markdown fences or extra explanation. Do not generate placeholder content such as Hello World. Build the actual app requested by the user.",
      },
      {
        role: "user",
        content: `Please generate a React + Vite project based on the following request:\n\n${prompt}\n\nOnly include the essential project files needed to run the app, and return exactly one JSON object matching the schema. Use the user's request as the source of truth and do not fallback to generic placeholder examples.`,
      },
    ],
    temperature: 0,
    max_tokens: 5000,
    response_format: {
      type: "json_object",
    },
  });

  const text = response.choices?.[0]?.message?.content?.trim() || "";

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (error) {
    console.error('Code generation JSON parse failed:', error, text);
    return { result: text, raw: text };
  }

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (error) {
    console.error('Code generation JSON parse failed:', error, text);
    return { result: text, raw: text };
  }
}

// ================= CLEAN JSON =================
export function cleanJsonResponse(text) {
  return text.replace(/```json|```/g, "").trim();
}