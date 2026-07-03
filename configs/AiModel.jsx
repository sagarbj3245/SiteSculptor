import OpenAI from "openai";
import Prompt from "@/data/Prompt";

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.1";

let openai;
function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function sendChatMessage(prompt) {
  const response = await getClient().chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 1000,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

export async function enhancePrompt(prompt) {
  const response = await getClient().chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: Prompt.ENHANCE_PROMPT_RULES },
      { role: "user", content: prompt },
    ],
    max_completion_tokens: 500,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

export async function generateCode(prompt) {
  const response = await getClient().chat.completions.create({
    model: DEFAULT_MODEL,
    ...(DEFAULT_MODEL.startsWith("gpt-5") && { reasoning_effort: "medium" }),
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that generates high-quality, production-grade Vite React projects. Return only valid JSON that matches the requested schema, with no markdown fences or extra explanation. Do not generate placeholder content such as Hello World. Build the actual app requested by the user. If CURRENT_FILES are included in the request, apply the latest user message as a modification to those files and return the complete updated project.",
      },
      {
        role: "user",
        content: `Please generate a React + Vite project based on the following request:\n\n${prompt}\n\nInclude all project files needed to run the app, and return exactly one JSON object matching the schema. Use the user's request as the source of truth and do not fallback to generic placeholder examples.`,
      },
    ],
    max_completion_tokens: 16000,
    response_format: { type: "json_object" },
  });

  const text = response.choices?.[0]?.message?.content?.trim() || "";

  try {
    return JSON.parse(cleanJsonResponse(text));
  } catch (error) {
    console.error("Code generation JSON parse failed:", error, text);
    return { result: text, raw: text };
  }
}

export function cleanJsonResponse(text) {
  return text.replace(/```json|```/g, "").trim();
}
