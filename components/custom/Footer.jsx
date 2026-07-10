"use client";

import React, { useState } from "react";
import Lookup from "@/data/Lookup";
import { Code, Mail, X, Send, Loader2, CheckCircle2 } from "lucide-react";

const GitHubIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LinkedInIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 5.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793 0 1.44.645 1.44 1.439z" />
    </svg>
);

const XBrandIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

function ContactModal({ dev, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const canSend = name.trim() && email.trim() && message.trim() && !sending;

    const openMailApp = () => {
        const finalSubject = subject.trim() || `Message from ${name.trim()} via SiteSculptor`;
        const body = `Hi ${dev.name},\n\n${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
        window.location.href = `mailto:${dev.email}?subject=${encodeURIComponent(
            finalSubject
        )}&body=${encodeURIComponent(body)}`;
        onClose();
    };

    const sendMessage = async () => {
        if (!canSend) return;

        setSending(true);
        setError(null);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const data = await res.json();

            if (data.sent) {
                setSent(true);
                setTimeout(onClose, 2000);
            } else if (res.status === 503) {
                openMailApp();
            } else {
                setError(data.error || "Could not send. Please try again.");
            }
        } catch {
            openMailApp();
        } finally {
            setSending(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.08)] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5 text-neutral-300" />
                        Contact {dev.name}
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                    Fill this in and your mail app opens with everything ready — just
                    press send.
                </p>
                <div className="space-y-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={60}
                        placeholder="Your name"
                        className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm transition-all duration-200"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={100}
                        type="email"
                        placeholder="Your email"
                        className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm transition-all duration-200"
                    />
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        maxLength={120}
                        placeholder="Subject"
                        className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm transition-all duration-200"
                    />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={1000}
                        placeholder="Your message..."
                        className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm h-28 resize-none transition-all duration-200"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!canSend || sent}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-5 py-2.5 shadow-[0_1px_12px_rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {sent ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Message sent!
                            </>
                        ) : sending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </button>
                    {error && (
                        <p className="text-amber-300 text-xs text-center">{error}</p>
                    )}
                    <p className="text-neutral-600 text-xs text-center">
                        or email directly:{" "}
                        <span className="text-neutral-400">{dev.email}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    const dev = Lookup.DEVELOPER;
    const [contactOpen, setContactOpen] = useState(false);
    const socials = [
        { href: dev.github, icon: GitHubIcon, label: "GitHub" },
        { href: dev.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
        { href: dev.twitter, icon: XBrandIcon, label: "X (Twitter)" },
        { href: dev.instagram, icon: InstagramIcon, label: "Instagram" },
    ].filter((s) => s.href);

    return (
        <footer className="bg-black border-t border-neutral-900">
            <div className="container mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-b from-white to-neutral-300 p-2 rounded-lg shadow-[0_1px_8px_rgba(255,255,255,0.15)]">
                                <Code className="h-5 w-5 text-black" />
                            </div>
                            <h2 className="text-xl font-semibold tracking-tight text-white">
                                SiteSculptor
                            </h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                            An AI-powered website builder — describe your idea in plain
                            words and get a production-ready React app with live preview
                            and one-click download.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                            About the Developer
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                            Designed &amp; developed by{" "}
                            <span className="text-white font-medium">{dev.name}</span>,{" "}
                            {dev.role.toLowerCase()} passionate about AI-driven developer
                            tools.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map(({ href, icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    title={label}
                                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 rounded-lg text-neutral-400 hover:text-white transition-all duration-200"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                            Contact
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                            Have feedback, found a bug, or want to collaborate? Reach out
                            anytime.
                        </p>
                        <button
                            onClick={() => setContactOpen(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-4 py-2.5 shadow-[0_1px_12px_rgba(255,255,255,0.15)] transition-all duration-200"
                        >
                            <Mail className="h-4 w-4" />
                            Send a message
                        </button>
                    </div>
                </div>

                <div className="border-t border-neutral-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 max-w-6xl mx-auto">
                    <p className="text-neutral-600 text-sm">
                        &copy; {new Date().getFullYear()} {dev.name}. All rights reserved.
                    </p>
                    <p className="text-neutral-600 text-sm">
                        Built with Next.js, Convex &amp; OpenAI
                    </p>
                </div>
            </div>

            {contactOpen && (
                <ContactModal dev={dev} onClose={() => setContactOpen(false)} />
            )}
        </footer>
    );
}

export default Footer;
