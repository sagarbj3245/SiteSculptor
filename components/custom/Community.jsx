"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CodeTicker, DevPanel, StorePanel } from "@/components/custom/ShowcaseSection";
import {
  Users,
  Star,
  Send,
  Loader2,
  ExternalLink,
  CheckCircle2,
  ShieldX,
  MessageSquareQuote,
} from "lucide-react";

class SectionBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback ?? null : this.props.children;
  }
}

function VisitsBadge() {
  const visits = useQuery(api.stats.GetVisits);
  const recordVisit = useMutation(api.stats.RecordVisit);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("ss_visit_counted")) {
        sessionStorage.setItem("ss_visit_counted", "1");
        recordVisit().catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-neutral-900/80 rounded-full px-5 py-2.5 border border-neutral-800">
      <Users className="h-4 w-4 text-neutral-200" />
      <span className="text-neutral-300 text-sm font-medium tracking-wide">
        {visits === undefined ? (
          "Counting builders..."
        ) : (
          <>
            <span className="text-white font-semibold tabular-nums">
              {visits.toLocaleString()}
            </span>{" "}
            {visits === 1 ? "builder has" : "builders have"} opened SiteSculptor
          </>
        )}
      </span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="w-72 shrink-0 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-b from-white to-neutral-300 text-black flex items-center justify-center font-semibold text-sm shrink-0">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white text-sm font-medium truncate">{review.name}</p>
            {review.socialUrl && (
              <a
                href={review.socialUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label={`${review.name}'s profile`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-neutral-200 fill-neutral-200" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-neutral-400 text-sm leading-relaxed break-words line-clamp-4">
        {review.text}
      </p>
    </div>
  );
}

function ReviewsMarquee() {
  const reviews = useQuery(api.reviews.GetPublishedReviews);

  if (reviews === undefined) {
    return (
      <div className="flex items-center justify-center h-36 text-neutral-500 gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-36 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
        <Star className="h-6 w-6 mb-2" />
        Be the first to leave a review
      </div>
    );
  }

  if (reviews.length < 4) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group">
      <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      <div className="flex gap-4 w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={`${review._id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewForm() {
  const [name, setName] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const submitReview = async () => {
    if (!name.trim() || !text.trim() || submitting) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, socialUrl, text }),
      });
      const data = await res.json();

      if (data.published) {
        setFeedback({ ok: true, msg: "Thank you! Your review is now live." });
        setName("");
        setSocialUrl("");
        setText("");
      } else if (res.status === 200) {
        setFeedback({
          ok: false,
          msg: "Your review was not published. Please keep it positive and respectful.",
        });
      } else {
        setFeedback({
          ok: false,
          msg: "Could not publish right now. Please try again later.",
        });
      }
    } catch {
      setFeedback({ ok: false, msg: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 h-full flex flex-col">
      <h3 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
        <Star className="h-5 w-5 text-neutral-300" />
        Write a review
      </h3>
      <p className="text-neutral-500 text-sm mb-5">
        Share your experience — it appears on the wall instantly after AI
        approval.
      </p>
      <div className="space-y-3 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Your name"
            className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm transition-all duration-200"
          />
          <input
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            maxLength={200}
            placeholder="Social link (optional)"
            className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm transition-all duration-200"
          />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="What did you build? How was the experience?"
          className="w-full bg-black/60 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-white/10 outline-none text-sm flex-1 min-h-[6rem] resize-none transition-all duration-200"
        />
        <button
          onClick={submitReview}
          disabled={!name.trim() || !text.trim() || submitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-white to-neutral-200 hover:to-neutral-300 text-black text-sm font-semibold rounded-lg px-5 py-2.5 shadow-[0_1px_12px_rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI is reviewing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Publish review
            </>
          )}
        </button>
        {feedback && (
          <div
            className={`flex items-start gap-2 text-sm rounded-lg p-3 border ${
              feedback.ok
                ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                : "text-amber-300 bg-amber-500/10 border-amber-500/20"
            }`}
          >
            {feedback.ok ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <ShieldX className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            {feedback.msg}
          </div>
        )}
      </div>
    </div>
  );
}

function Community() {
  return (
    <section className="bg-black border-t border-neutral-900 relative overflow-hidden">
      <CodeTicker />
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_0%,rgba(255,255,255,0.04),transparent)]" />
      <div className="container mx-auto px-4 py-16 relative z-10 space-y-10">
        <div className="text-center space-y-4">
          <SectionBoundary
            fallback={
              <div className="inline-flex items-center gap-2 bg-neutral-900/80 rounded-full px-5 py-2.5 border border-neutral-800">
                <Users className="h-4 w-4 text-neutral-200" />
                <span className="text-neutral-300 text-sm font-medium tracking-wide">
                  Builders worldwide use SiteSculptor
                </span>
              </div>
            }
          >
            <VisitsBadge />
          </SectionBoundary>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 leading-tight pb-1">
            From Idea to Live Website
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            You describe it. The AI builds it. Your visitors use it — all in
            minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <DevPanel />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-3 text-neutral-400 text-sm font-medium">
                <MessageSquareQuote className="h-4 w-4" />
                What builders say
                <span className="text-neutral-600 text-xs">
                  — AI-screened, only genuine feedback
                </span>
              </div>
              <SectionBoundary
                fallback={
                  <div className="flex flex-col items-center justify-center h-36 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                    <Star className="h-6 w-6 mb-2" />
                    Reviews are warming up — check back in a moment
                  </div>
                }
              >
                <ReviewsMarquee />
              </SectionBoundary>
            </div>
          </div>

          <div className="grid grid-rows-[1fr_1fr] gap-6 min-w-0 h-full">
            <ReviewForm />
            <StorePanel />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Community;
