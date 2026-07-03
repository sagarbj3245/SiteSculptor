"use client";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import { Sparkles, Send, Wand2, Loader2 } from "lucide-react";
import React, { useContext, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
    const [userInput, setUserInput] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { setMessages } = useContext(MessagesContext);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    const busy = isEnhancing || isCreating;

    const onGenerate = async (input) => {
        if (!input?.trim() || busy) return;

        setIsCreating(true);
        try {
            const msg = { role: "user", content: input.trim() };
            setMessages([msg]);
            const workspaceID = await CreateWorkspace({ messages: [msg] });
            router.push("/workspace/" + workspaceID);
        } catch (error) {
            console.error("Error creating workspace:", error);
            setIsCreating(false);
        }
    };

    const enhancePrompt = async () => {
        if (!userInput?.trim() || busy) return;

        setIsEnhancing(true);
        try {
            const response = await fetch("/api/enhance-prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userInput }),
            });

            const data = await response.json();
            if (data.enhancedPrompt) {
                setUserInput(data.enhancedPrompt);
            }
        } catch (error) {
            console.error("Error enhancing prompt:", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onGenerate(userInput);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]">
                <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_400px_at_50%_250px,rgba(255,255,255,0.07),transparent)]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center space-x-2 bg-neutral-900/80 rounded-full px-5 py-2.5 border border-neutral-800">
                            <Sparkles className="h-4 w-4 text-neutral-200" />
                            <span className="text-neutral-300 text-sm font-medium tracking-wide">
                                Sculpt Your Website with AI
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 leading-tight pb-2">
                            Code the <br className="md:hidden" />Impossible
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto">
                            Transform your ideas into production-ready websites with AI assistance
                        </p>
                    </div>

                    <div className="w-full max-w-3xl bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-[0_0_60px_rgba(255,255,255,0.04)] p-6">
                        <textarea
                            placeholder="Describe the website you want to build..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-black/60 border border-neutral-800 rounded-xl p-4 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-base h-36 resize-none transition-all duration-200"
                            disabled={busy}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={enhancePrompt}
                                disabled={!userInput?.trim() || busy}
                                title="Enhance prompt with AI"
                                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isEnhancing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="h-4 w-4" />
                                )}
                                Enhance
                            </button>
                            <button
                                onClick={() => onGenerate(userInput)}
                                disabled={!userInput?.trim() || busy}
                                title="Generate website"
                                className="flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-5 py-2.5 shadow-[0_1px_12px_rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                Generate
                            </button>
                        </div>
                    </div>

                    <div className="w-full max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Lookup?.SUGGESTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => setUserInput(suggestion)}
                                    className="group p-5 bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 rounded-xl text-left transition-all duration-300 hover:border-neutral-600"
                                >
                                    <span className="text-neutral-400 group-hover:text-white text-sm transition-colors duration-300">
                                        {suggestion}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
