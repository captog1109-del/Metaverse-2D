"use client";

import Link from "next/link";
import glass from "../styles/glass.module.css";
import s from "./connectionState.module.css";

export type ConnectionVariant =
  | "connecting" // waiting for the first socket connection
  | "error" // first connection failed
  | "config" // production build without NEXT_PUBLIC_SERVER_URL
  | "reconnecting" // dropped while playing; socket.io is retrying
  | "disconnected" // server closed the session
  | "world-loading" // Phaser assets loading
  | "world-error"; // a Phaser asset failed to load

interface ConnectionStateProps {
  variant: ConnectionVariant;
  /** Draw as a dimmed layer over the game instead of a full page. */
  overlay?: boolean;
  /** 0–1, only used by "world-loading". */
  progress?: number;
}

const COPY: Record<ConnectionVariant, { title: string; text: string }> = {
  connecting: {
    title: "Connecting to the office",
    text: "Hang tight while we find you a spot.",
  },
  error: {
    title: "Can't reach the office server",
    text: "We'll keep trying. If it doesn't connect, check your internet connection or reload the page.",
  },
  config: {
    title: "Server address isn't set",
    text: "This build has no NEXT_PUBLIC_SERVER_URL, so the office can't connect. Set it in your hosting settings and redeploy.",
  },
  reconnecting: {
    title: "Connection lost",
    text: "Trying to reconnect. You'll rejoin at the starting point.",
  },
  disconnected: {
    title: "You were disconnected",
    text: "The server closed your session. Reload the page to rejoin.",
  },
  "world-loading": {
    title: "Loading the office",
    text: "Setting up the map and avatars.",
  },
  "world-error": {
    title: "Some office files didn't load",
    text: "Reload the page to try again. If it keeps happening, check your connection.",
  },
};

const isBusy = (v: ConnectionVariant) =>
  v === "connecting" || v === "reconnecting" || v === "world-loading";

const canReload = (v: ConnectionVariant) =>
  v === "error" || v === "disconnected" || v === "world-error";

export default function ConnectionState({ variant, overlay = false, progress }: ConnectionStateProps) {
  const { title, text } = COPY[variant];
  const busy = isBusy(variant);
  const pct = Math.round(Math.min(1, Math.max(0, progress ?? 0)) * 100);

  const card = (
    <div
      className={`${glass.glassStrong} ${s.card}`}
      role={busy ? "status" : "alert"}
      aria-live={busy ? "polite" : "assertive"}
    >
      <div className={`${s.icon} ${busy ? "" : s.iconError}`} aria-hidden="true">
        {busy ? (
          <span className={s.spinner} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        )}
      </div>
      <h1 className={s.title}>{title}</h1>
      <p className={s.text}>{text}</p>

      {variant === "world-loading" && (
        <>
          <div className={s.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className={s.progressBar} style={{ width: `${pct}%` }} />
          </div>
          <p className={s.progressLabel}>{pct}%</p>
        </>
      )}

      {!busy && (
        <div className={s.actions}>
          {canReload(variant) && (
            <button
              type="button"
              className={`${glass.btn} ${glass.btnPrimary}`}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          )}
          <Link href="/" className={`${glass.btn} ${glass.btnNeutral}`}>
            Back to home
          </Link>
        </div>
      )}
    </div>
  );

  if (overlay) return <div className={s.overlay}>{card}</div>;
  return <div className={`${glass.ambient} ${s.screen}`}>{card}</div>;
}
