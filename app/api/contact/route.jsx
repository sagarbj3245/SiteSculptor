import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Lookup from "@/data/Lookup";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    const cleanName = (name || "").trim().slice(0, 60);
    const cleanEmail = (email || "").trim().slice(0, 100);
    const cleanSubject = (subject || "").trim().slice(0, 120);
    const cleanMessage = (message || "").trim().slice(0, 2000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return NextResponse.json(
        { error: "Email sending is not configured" },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"SiteSculptor Contact" <${user}>`,
      to: Lookup.DEVELOPER.email,
      replyTo: `"${cleanName}" <${cleanEmail}>`,
      subject: cleanSubject || `New message from ${cleanName} via SiteSculptor`,
      text: `${cleanMessage}\n\n— ${cleanName} (${cleanEmail})\nSent from the SiteSculptor contact form`,
    });

    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error("Contact Error:", e);
    return NextResponse.json(
      { error: "Could not send the message" },
      { status: 500 }
    );
  }
}
