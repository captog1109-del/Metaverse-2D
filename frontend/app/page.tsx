"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import glass from "./styles/glass.module.css";
import s from "./page.module.css";

// ==================== TYPES ====================
type ModalId = "signup" | "signin";
type NotificationType = "success" | "error" | "info";

interface NotificationState {
  message: string;
  type: NotificationType;
  visible: boolean;
}

// ==================== ICONS (inline, no extra dependency) ====================
const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const MoveIcon = () => (
  <svg {...iconProps} className={s.featureIcon}>
    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
  </svg>
);

const UsersIcon = () => (
  <svg {...iconProps} className={s.featureIcon}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BrushIcon = () => (
  <svg {...iconProps} className={s.featureIcon}>
    <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
    <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7M14.5 17.5 4.5 15" />
  </svg>
);

const ArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5Z" />
  </svg>
);

// ==================== COMPONENT ====================
export default function Page() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    visible: false,
  });

  // Form state
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });
  const [signinForm, setSigninForm] = useState({ emailOrUsername: "", password: "" });

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback((message: string, type: NotificationType = "info") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setNotification({ message, type, visible: true });
    toastTimer.current = setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const openModal = (id: ModalId) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);
  const switchModal = (id: ModalId) => {
    setActiveModal(null);
    setTimeout(() => setActiveModal(id), 100);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password } = signupForm;
    if (!username || !email || !password) return showNotification("Please fill in all fields", "error");
    if (username.length < 3) return showNotification("Username must be at least 3 characters", "error");
    if (!isValidEmail(email)) return showNotification("Please enter a valid email address", "error");
    if (password.length < 6) return showNotification("Password must be at least 6 characters", "error");
    showNotification("Account created successfully! Welcome to Metaverse 2D.", "success");
    setSignupForm({ username: "", email: "", password: "" });
    setTimeout(closeModal, 1500);
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    const { emailOrUsername, password } = signinForm;
    if (!emailOrUsername || !password) return showNotification("Please fill in all fields", "error");
    if (password.length < 6) return showNotification("Password must be at least 6 characters", "error");
    showNotification("Welcome back to Metaverse 2D!", "success");
    setSigninForm({ emailOrUsername: "", password: "" });
    setTimeout(closeModal, 1500);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const toastClass =
    notification.type === "success" ? s.toastSuccess : notification.type === "error" ? s.toastError : "";

  return (
    <div className={glass.ambient}>
      {/* ========== HEADER ========== */}
      <SiteHeader
        actions={
          <>
            <button type="button" className={s.link} onClick={() => openModal("signin")}>
              Sign in
            </button>
            <Link href="/meta" className={`${glass.btn} ${glass.btnPrimary} ${s.enterDesktop}`} style={{ height: 44 }}>
              Enter workspace
            </Link>
          </>
        }
      />

      <main className={s.main}>
        {/* ========== HERO ========== */}
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>A virtual workspace for real teams</p>
            <div>
              <h1 className={s.headline}>
                Your office, beyond the screen.
                <span className={s.onlyDesktop}>
                  <br />
                  Work together in a world you can walk through.
                </span>
              </h1>
              <p className={s.lede}>
                <span className={s.onlyDesktop}>
                  A lightweight 2D workspace where your team can move, meet, and connect in real time.
                </span>
                <span className={s.onlyMobile}>Move, meet, and connect in real time.</span>
              </p>
            </div>
            <div className={s.ctas}>
              <Link href="/meta" className={`${glass.btn} ${glass.btnPrimary}`}>
                Enter the office
                <span className={s.onlyDesktop}>
                  <ArrowUpRight />
                </span>
              </Link>
              <Link href="/#how-it-works" className={`${glass.btn} ${glass.btnGlass}`}>
                See how it works
              </Link>
            </div>
          </div>

          <div className={s.visual}>
            {/* Illustrated office preview */}
            <div className={`${glass.glass} ${s.previewFrame}`}>
              <div className={s.preview} role="img" aria-label="Illustration of a 2D office with teammates in different rooms">
                <div className={s.previewSage} />
                <div className={s.previewGrid} />
                <div className={`${s.roomLabel} ${glass.pill}`}>Central Plaza</div>

                <div className={s.greeting}>
                  <ChatIcon />
                  <div>
                    <div className={s.greetingTitle}>Good morning, Jamie</div>
                    <div className={s.greetingSub}>Tap a room to explore</div>
                  </div>
                </div>

                <div className={`${s.room} ${s.roomWelcome}`}>
                  <span className={s.roomTag}>Welcome</span>
                  <span className={s.mat} />
                </div>
                <div className={`${s.room} ${s.roomMeeting}`}>
                  <span className={s.roomTag}>Meeting room</span>
                  <span className={s.deskNote}>At my desk</span>
                </div>
                <div className={`${s.room} ${s.roomKitchen}`}>
                  <span className={s.roomTag}>Kitchen</span>
                </div>
                <div className={s.desk} />
                <div className={`${s.room} ${s.roomLounge}`}>
                  <span className={s.roomTag}>Lounge</span>
                </div>

                <div className={`${s.person} ${s.maya}`}>
                  <div className={s.avatar}>M</div>
                  <span className={s.name}>Maya</span>
                </div>
                <div className={`${s.person} ${s.jamie}`}>
                  <div className={`${s.avatar} ${s.avatarMe}`}>J</div>
                  <span className={s.name}>Jamie</span>
                </div>
                <div className={`${s.person} ${s.theo}`}>
                  <div className={s.avatar}>T</div>
                  <span className={s.name}>Theo</span>
                </div>
                <div className={`${s.person} ${s.priya}`}>
                  <div className={s.avatar}>P</div>
                  <span className={s.name}>Priya</span>
                </div>
                <div className={`${s.person} ${s.sam}`}>
                  <div className={s.avatar}>S</div>
                  <span className={s.name}>Sam</span>
                </div>
              </div>
            </div>

            {/* Team photo strip (placeholder art until the office photo is supplied) */}
            <div className={`${glass.glassSoft} ${s.photo}`}>
              <div className={s.photoArt} aria-hidden="true" />
              <div className={s.photoVeil} aria-hidden="true" />
              <div className={s.photoText}>
                <div className={s.photoKicker}>Built for real teams</div>
                <div className={s.photoTitle}>Drop in. Say hi. Get work done.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FEATURES ========== */}
        <section id="how-it-works" className={s.features}>
          <h2 className={s.featuresTitle}>Move like you mean it</h2>
          <div className={s.featureGrid}>
            <article className={`${s.feature} ${s.featureCream}`}>
              <MoveIcon />
              <h3 className={s.featureTitle}>
                <span className={s.onlyDesktop}>Move like you mean it</span>
                <span className={s.onlyMobile}>Move around</span>
              </h3>
              <p className={s.featureText}>
                <span className={s.onlyDesktop}>
                  Walk over to a teammate’s desk, wander through shared spaces, and make presence feel natural.
                </span>
                <span className={s.onlyMobile}>Explore shared spaces and find your way around naturally.</span>
              </p>
            </article>
            <article className={`${s.feature} ${s.featureMint}`}>
              <UsersIcon />
              <h3 className={s.featureTitle}>
                <span className={s.onlyDesktop}>Meet in the moment</span>
                <span className={s.onlyMobile}>Meet naturally</span>
              </h3>
              <p className={s.featureText}>
                <span className={s.onlyDesktop}>
                  Start spontaneous conversations without another calendar invite or another tab to open.
                </span>
                <span className={s.onlyMobile}>
                  Run into teammates, start a conversation, and stay connected.
                </span>
              </p>
            </article>
            <Link href="/space" className={`${s.feature} ${s.featureLavender}`}>
              <BrushIcon />
              <h3 className={s.featureTitle}>
                <span className={s.onlyDesktop}>Make spaces your own</span>
                <span className={s.onlyMobile}>Your spaces</span>
              </h3>
              <p className={s.featureText}>
                <span className={s.onlyDesktop}>
                  Shape rooms that reflect how your team works, from focused corners to lively gathering places.
                </span>
                <span className={s.onlyMobile}>Shape welcoming rooms for focused work and shared moments.</span>
              </p>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* ========== SIGN UP MODAL ========== */}
      {activeModal === "signup" && (
        <div
          className={s.overlay}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={`${glass.glassStrong} ${s.dialog}`} role="dialog" aria-modal="true" aria-labelledby="signup-title">
            <button type="button" className={s.close} onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2 id="signup-title" className={s.dialogTitle}>Create account</h2>
            <form onSubmit={handleSignup} noValidate={false}>
              <label className={s.field}>
                <span className={s.fieldLabel}>Username</span>
                <input
                  className={s.input}
                  type="text"
                  placeholder="Enter your username"
                  value={signupForm.username}
                  onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                  autoFocus
                  required
                />
              </label>
              <label className={s.field}>
                <span className={s.fieldLabel}>Email</span>
                <input
                  className={s.input}
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                />
              </label>
              <label className={s.field}>
                <span className={s.fieldLabel}>Password</span>
                <input
                  className={s.input}
                  type="password"
                  placeholder="Create a password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  required
                />
              </label>
              <button type="submit" className={`${glass.btn} ${glass.btnPrimary} ${s.submit}`}>
                Sign up
              </button>
            </form>
            <p className={s.switch}>
              Already have an account?{" "}
              <button type="button" className={s.switchBtn} onClick={() => switchModal("signin")}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========== SIGN IN MODAL ========== */}
      {activeModal === "signin" && (
        <div
          className={s.overlay}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={`${glass.glassStrong} ${s.dialog}`} role="dialog" aria-modal="true" aria-labelledby="signin-title">
            <button type="button" className={s.close} onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2 id="signin-title" className={s.dialogTitle}>Welcome back</h2>
            <form onSubmit={handleSignin}>
              <label className={s.field}>
                <span className={s.fieldLabel}>Email or username</span>
                <input
                  className={s.input}
                  type="text"
                  placeholder="Enter your email or username"
                  value={signinForm.emailOrUsername}
                  onChange={(e) => setSigninForm({ ...signinForm, emailOrUsername: e.target.value })}
                  autoFocus
                  required
                />
              </label>
              <label className={s.field}>
                <span className={s.fieldLabel}>Password</span>
                <input
                  className={s.input}
                  type="password"
                  placeholder="Enter your password"
                  value={signinForm.password}
                  onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                  required
                />
              </label>
              <button type="submit" className={`${glass.btn} ${glass.btnPrimary} ${s.submit}`}>
                Sign in
              </button>
            </form>
            <p className={s.switch}>
              Don&apos;t have an account?{" "}
              <button type="button" className={s.switchBtn} onClick={() => switchModal("signup")}>
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========== NOTIFICATION ========== */}
      {notification.visible && (
        <div className={`${glass.glassStrong} ${s.toast} ${toastClass}`} role="status" aria-live="polite">
          {notification.message}
        </div>
      )}
    </div>
  );
}
