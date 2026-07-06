import { moderateReview } from "@/configs/AiModel";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req) {
  try {
    const { name, socialUrl, text } = await req.json();

    const cleanName = (name || "").trim().slice(0, 60);
    const cleanText = (text || "").trim().slice(0, 500);
    let cleanUrl = (socialUrl || "").trim().slice(0, 200);

    if (!cleanName || !cleanText) {
      return NextResponse.json(
        { error: "Name and review are required" },
        { status: 400 }
      );
    }

    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    const approved = await moderateReview(cleanName, cleanText);

    if (!approved) {
      return NextResponse.json({ published: false });
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    await convex.mutation(api.reviews.AddReview, {
      name: cleanName,
      socialUrl: cleanUrl || undefined,
      text: cleanText,
      status: "published",
    });

    return NextResponse.json({ published: true });
  } catch (e) {
    console.error("Review Error:", e);
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
