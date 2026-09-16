"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  socket: any;
  nearbyPlayerIds: string[];
}

export default function ChatOverlay({ socket, nearbyPlayerIds }: Props) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasNearby = nearbyPlayerIds.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "t" || e.key === "T" || e.key === "Enter") && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 60);
      }
      if (e.key === "Escape" && isOpen) closeInput();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const closeInput = () => {
    setIsFading(true);
    setTimeout(() => { setIsOpen(false); setIsFading(false); setInput(""); }, 180);
  };

  const sendMessage = () => {
    const msg = input.trim();
    if (!msg || !socket) return;
    socket.emit("chat", msg);
    setInput("");
    closeInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
    if (e.key === "Escape") closeInput();
    e.stopPropagation();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .chat-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        @keyframes inputSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes inputSlideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(16px); }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.75; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .input-enter { animation: inputSlideUp  0.2s  cubic-bezier(0.22,1,0.36,1) forwards; }
        .input-exit  { animation: inputSlideDown 0.18s ease-in forwards; }
        .hint-pulse  { animation: hintPulse 2.4s ease-in-out infinite; }

        .send-btn {
          background: linear-gradient(135deg, #3b9eff 0%, #1e6fd9 100%);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .send-btn:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 0 18px rgba(59,158,255,0.55);
        }
        .send-btn:active:not(:disabled) { transform: scale(0.97); }
        .send-btn:disabled {
          background: rgba(255,255,255,0.08);
          opacity: 0.45;
          cursor: not-allowed;
        }
        .chat-input:focus { outline: none; }
        .chat-input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>

      <div
        className="chat-root"
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 28,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {/* Proximity hint */}
        {hasNearby && !isOpen && (
          <div
            className="hint-pulse"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#3bff8a", boxShadow: "0 0 6px #3bff8a",
              animation: "dotBlink 1.4s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em", fontWeight: 500 }}>
              {nearbyPlayerIds.length} player{nearbyPlayerIds.length > 1 ? "s" : ""} nearby
            </span>
            <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.12)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em", fontFamily: "monospace" }}>
              T to chat
            </span>
          </div>
        )}

        {/* Chat input */}
        {isOpen && (
          <div
            className={isFading ? "input-exit" : "input-enter"}
            style={{ pointerEvents: "all", width: "100%", maxWidth: 480, padding: "0 16px" }}
          >
            {/* Top label row */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                color: hasNearby ? "rgba(59,158,255,0.7)" : "rgba(255,100,100,0.6)",
              }}>
                {hasNearby
                  ? `${nearbyPlayerIds.length} player${nearbyPlayerIds.length > 1 ? "s" : ""} in range`
                  : "No one nearby"}
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                esc to close
              </span>
            </div>

            {/* Input pill */}
            <div style={{
              display: "flex", gap: 10, padding: "6px 6px 6px 16px",
              borderRadius: 999,
              background: "rgba(10,12,24,0.82)",
              border: "1px solid rgba(59,158,255,0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasNearby ? "Say something…" : "No one can hear you right now…"}
                maxLength={200}
                className="chat-input"
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#fff", fontSize: 13.5, fontWeight: 400,
                  letterSpacing: "0.01em", padding: "8px 0", minWidth: 0,
                }}
              />

              {/* Char counter */}
              {input.length > 150 && (
                <span style={{
                  alignSelf: "center", fontSize: 10, flexShrink: 0, fontFamily: "monospace",
                  color: input.length > 180 ? "#ff6b6b" : "rgba(255,255,255,0.3)",
                }}>
                  {200 - input.length}
                </span>
              )}

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="send-btn"
                style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}