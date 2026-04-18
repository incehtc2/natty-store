"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const MESSAGES = [
  { text: "Yaz Kampanyası — Seçili ürünlerde %30'a varan indirim", link: "/kampanya" },
  { text: "Ücretsiz Kargo — 5000 ₺ ve üzeri tüm siparişlerde", link: null },
  { text: "El İşçiliği · Hakiki Deri · Türkiye Tasarımı", link: null },
];

export default function AnnouncementBar({ onHide }: { onHide: () => void }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const switchTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 300);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(prev => (prev + 1) % MESSAGES.length);
    }, 4500);

    return () => clearInterval(t);
  }, []);

  const close = () => {
    setVisible(false);
    onHide();
  };

  if (!visible) return null;

  const msg = MESSAGES[idx];

  return (
    <div className="h-9 bg-charcoal flex items-center justify-center relative px-10 overflow-hidden">
      <button
        onClick={() => switchTo((idx - 1 + MESSAGES.length) % MESSAGES.length)}
        className="absolute left-3 text-white/40 hover:text-white transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      <p
        className={`text-[11px] tracking-widest text-white/80 text-center transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {msg.link ? (
          <a href={msg.link} className="hover:text-white underline underline-offset-2 transition-colors">
            {msg.text}
          </a>
        ) : (
          msg.text
        )}
      </p>

      <button
        onClick={() => switchTo((idx + 1) % MESSAGES.length)}
        className="absolute right-8 text-white/40 hover:text-white transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      <button
        onClick={close}
        className="absolute right-3 text-white/30 hover:text-white transition-colors"
      >
        <X size={13} />
      </button>

      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-300 ${
              i === idx ? "w-3 h-1 bg-white/60" : "w-1 h-1 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}