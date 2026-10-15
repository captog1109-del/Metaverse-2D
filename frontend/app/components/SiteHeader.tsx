import Link from "next/link";
import type { ReactNode } from "react";
import glass from "../styles/glass.module.css";
import s from "./siteChrome.module.css";

interface SiteHeaderProps {
  /** Highlights the matching nav item. */
  active?: "spaces";
  /** Right-hand actions (sign in, enter workspace, back to home…). */
  actions: ReactNode;
}

/**
 * Frosted-glass top bar from the Flowstep designs.
 * "Community" has no page yet, so it renders as non-interactive text.
 */
export default function SiteHeader({ active, actions }: SiteHeaderProps) {
  return (
    <header className={`${glass.glass} ${s.header}`}>
      <div className={s.left}>
        <Link href="/" className={s.brand} aria-label="Metaverse 2D home">
          <span className={s.brandDot} aria-hidden="true" />
          <span>Metaverse 2D</span>
        </Link>
        <nav className={s.nav} aria-label="Primary">
          <Link href="/#how-it-works" className={s.navItem}>
            How it works
          </Link>
          <Link
            href="/space"
            className={`${s.navItem} ${active === "spaces" ? s.navActive : ""}`}
            aria-current={active === "spaces" ? "page" : undefined}
          >
            Spaces
          </Link>
          <span className={`${s.navItem} ${s.soon}`} title="Coming soon">
            Community
          </span>
        </nav>
      </div>
      <div className={s.right}>{actions}</div>
    </header>
  );
}
