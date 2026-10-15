"use client";

import Link from "next/link";
import s from "./gameHud.module.css";

interface GameHudProps {
  /** Players currently known to the client (includes you). */
  playerCount: number;
}

/**
 * Presentational HUD over the Phaser canvas. It only reads data the game already
 * pushes to React (the player list) — it adds no new socket events.
 */
export default function GameHud({ playerCount }: GameHudProps) {
  const onlyMe = playerCount === 1;

  return (
    <div className={s.hud}>
      <div className={s.top}>
        <Link href="/" className={s.chip} aria-label="Leave the office and go to the home page">
          <span className={s.dot} aria-hidden="true" />
          Metaverse 2D
        </Link>

        {playerCount > 0 && (
          <div className={s.chip} role="status" aria-live="polite">
            <span className={s.live} aria-hidden="true" />
            <span className={s.count}>
              {playerCount} in the office
            </span>
          </div>
        )}
      </div>

      {onlyMe && (
        <div className={s.empty} role="status">
          <span>
            <strong>You&apos;re the first one here.</strong> Teammates appear on the map as they join.
          </span>
        </div>
      )}

      <div className={s.hints}>
        <span className={`${s.hint} ${s.keyHints}`}>
          <span className={s.key}>←</span>
          <span className={s.key}>↑</span>
          <span className={s.key}>↓</span>
          <span className={s.key}>→</span>
          move
        </span>
        <span className={`${s.hint} ${s.keyHints}`}>
          <span className={s.key}>T</span>
          chat
        </span>
        <span className={`${s.hint} ${s.touchNote}`}>Moving and chatting need a keyboard. Open on a computer to play.</span>
      </div>
    </div>
  );
}
