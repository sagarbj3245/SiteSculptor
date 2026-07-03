"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { Loader2Icon, Send } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const updateMessages = useMutation(api.workspace.UpdateWorkspace);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) fetchWorkspaceMessages();
  }, [id]);

  const fetchWorkspaceMessages = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setMessages(result?.messages || []);
    } catch (error) {
      console.error("Error fetching workspace messages:", error);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const lastRole = messages[messages.length - 1].role;
      if (lastRole === "user") generateAiResponse();
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAiResponse = async () => {
    setLoading(true);
    try {
      const prompt = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt });

      const aiMessage = {
        role: "ai",
        content: result.data?.result || "No response received.",
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (id) {
        await updateMessages({
          workspaceId: id,
          messages: [...(messages || []), aiMessage],
        });
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, something went wrong while generating a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!userInput?.trim() || loading) return;

    const userMessage = { role: "user", content: userInput.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-7.5rem)] rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-4">
        <div className="space-y-4">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-neutral-900/70 border border-neutral-800"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide shrink-0 ${
                      msg.role === "user"
                        ? "bg-white text-black"
                        : "bg-neutral-800 text-neutral-200 border border-neutral-700"
                    }`}
                  >
                    {msg.role === "user" ? "You" : "AI"}
                  </span>
                  <div className="prose prose-invert prose-sm flex-1 min-w-0 break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

          {loading && (
            <div className="p-4 rounded-lg bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center gap-3 text-neutral-400">
                <Loader2Icon className="animate-spin h-5 w-5" />
                <p className="font-medium">Generating response...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-black/40 backdrop-blur-sm p-3">
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Describe what you want to change or build..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none resize-none h-20 text-sm transition-all duration-200"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={!userInput?.trim() || loading}
              aria-label="Send message"
              className="flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
