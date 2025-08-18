import { NextResponse } from "next/server";
import { GenAiCode } from '@/configs/AiModel';

export async function POST(req) {
    let respText; // so we can use it in catch
    try {
        const { prompt } = await req.json();
        const result = await GenAiCode.sendMessage(prompt);

        // Await the response text
        respText = await result.response.text();

        return NextResponse.json(JSON.parse(respText));
    } catch (e) {
        // Handle Google Generative AI quota errors
        if (e?.status === 429) {
            return NextResponse.json({
                error: "Quota exceeded: You have reached your daily limit for the AI model. Please try again later."
            });
        }

        // Fallback for other errors
        return NextResponse.json({ error: respText || e.message });
    }
}
