import s from "./siteChrome.module.css";

/** Footer from the Flowstep designs. Legal/contact pages don't exist yet, so these are plain text. */
export default function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerBrand}>Metaverse 2D</div>
      <div className={s.footerTagline}>A calmer way to work together.</div>
      <nav className={s.footerLinks} aria-label="Footer">
        <span title="Coming soon">Privacy</span>
        <span title="Coming soon">Terms</span>
        <span title="Coming soon">Contact</span>
      </nav>
    </footer>
  );
}
