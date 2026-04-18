"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200);
  };

  if (status === "done") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center">
          <Check size={14} className="text-charcoal" />
        </div>
        <p className="text-sm text-charcoal font-light">Abone olduğunuz için teşekkürler.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-0 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        required
        className="flex-1 border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-charcoal text-cream px-5 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors flex-shrink-0 disabled:opacity-60 flex items-center gap-2"
      >
        {status === "loading" ? <Loader2 size={12} className="animate-spin" /> : "ABONE OL"}
      </button>
    </form>
  );
}
