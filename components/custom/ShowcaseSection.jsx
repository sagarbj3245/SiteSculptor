import React from "react";
import { MousePointer2, ShoppingCart, CheckCircle2, Terminal, Globe } from "lucide-react";

const TICKER_ITEMS = [
  "npx create-vite@latest",
  "<Navbar />",
  "tailwind.config.js",
  "JWT auth ready",
  "const store = sculpt(idea)",
  "<ProductGrid items={12} />",
  "live preview ✓",
  "responsive by default",
  "git push origin main",
  "order.status = 'placed'",
];

export function CodeTicker() {
  const row = (prefix) =>
    TICKER_ITEMS.map((item, i) => (
      <span key={`${prefix}${i}`} className="flex items-center gap-8 shrink-0" aria-hidden={prefix === "b"}>
        <span>{item}</span>
        <span className="text-neutral-800">•</span>
      </span>
    ));

  return (
    <div className="border-y border-neutral-900 bg-neutral-950/60 overflow-hidden py-2.5">
      <div className="flex gap-8 w-max font-mono text-xs text-neutral-600 animate-[marquee_30s_linear_infinite]">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

function BrowserFrame({ label, icon: Icon, children }) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-black/40">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        <div className="ml-3 flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1 text-xs text-neutral-500 font-mono">
          <Icon className="h-3 w-3" />
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}

export function DevPanel() {
  return (
    <BrowserFrame label="sitesculptor — building" icon={Terminal}>
      <div className="relative flex-1 flex flex-col">
        <img
          src="https://user-images.githubusercontent.com/74038190/235224431-e8c8c12e-6826-47f1-89fb-2ddad83b3abf.gif"
          alt="Developer building a website with AI"
          className="w-full flex-1 min-h-[13rem] object-cover grayscale contrast-125 opacity-90"
        />
        <div className="px-4 py-3 border-t border-neutral-800 bg-black/60 font-mono text-xs text-neutral-400 flex items-center gap-2">
          <span className="text-neutral-600">&gt;</span>
          <span className="relative overflow-hidden whitespace-nowrap inline-block align-bottom animate-[type-line_6s_steps(34)_infinite]">
            sculpt(&quot;a sneaker store with login&quot;)
          </span>
          <span className="inline-block w-2 h-3.5 bg-neutral-300 animate-[caret-blink_1s_steps(1)_infinite]" />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-neutral-800 flex items-center justify-between">
        <p className="text-sm text-neutral-400">The AI writes real React code, live</p>
        <span className="text-xs text-neutral-600 font-mono">01</span>
      </div>
    </BrowserFrame>
  );
}

export function StorePanel() {
  return (
    <BrowserFrame label="kickvault.shop — generated site" icon={Globe}>
      <div className="relative flex-1 min-h-[13rem] bg-neutral-950 overflow-hidden select-none">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800">
          <span className="text-xs font-semibold text-white tracking-wide">KICKVAULT</span>
          <div className="relative">
            <ShoppingCart className="h-4 w-4 text-neutral-400" />
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center animate-[demo-badge_7s_ease-in-out_infinite]">
              1
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center h-full pb-10">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 w-44 animate-[float-soft_5s_ease-in-out_infinite]">
            <div className="h-14 rounded-lg bg-gradient-to-b from-neutral-700 to-neutral-800 mb-3 flex items-center justify-center text-2xl">
              👟
            </div>
            <p className="text-white text-xs font-semibold">Air Runner Pro</p>
            <p className="text-neutral-500 text-xs mb-2.5">$129.00</p>
            <div className="relative inline-block">
              <button
                tabIndex={-1}
                className="bg-gradient-to-b from-white to-neutral-200 text-black text-[10px] font-bold rounded-md px-3 py-1.5 animate-[demo-press_7s_ease-in-out_infinite]"
              >
                Add to Cart
              </button>
              <MousePointer2 className="absolute -bottom-2 -right-2 h-4 w-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] animate-[demo-cursor_7s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white shadow-xl animate-[demo-toast_7s_ease-in-out_infinite]">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          Order placed — thank you!
        </div>
      </div>
      <div className="px-4 py-3 border-t border-neutral-800 flex items-center justify-between">
        <p className="text-sm text-neutral-400">Real visitors use what you built</p>
        <span className="text-xs text-neutral-600 font-mono">02</span>
      </div>
    </BrowserFrame>
  );
}
