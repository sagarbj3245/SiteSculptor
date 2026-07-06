import React from "react";
import Lookup from "@/data/Lookup";
import { Code, Mail, Github, Linkedin, Twitter } from "lucide-react";

function Footer() {
    const dev = Lookup.DEVELOPER;
    const socials = [
        { href: dev.github, icon: Github, label: "GitHub" },
        { href: dev.linkedin, icon: Linkedin, label: "LinkedIn" },
        { href: dev.twitter, icon: Twitter, label: "Twitter / X" },
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
                        <a
                            href={`mailto:${dev.email}`}
                            className="inline-flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-4 py-2.5 shadow-[0_1px_12px_rgba(255,255,255,0.15)] transition-all duration-200"
                        >
                            <Mail className="h-4 w-4" />
                            {dev.email}
                        </a>
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
        </footer>
    );
}

export default Footer;
