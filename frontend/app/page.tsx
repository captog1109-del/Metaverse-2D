"use client";

import { useState, useEffect, useCallback } from "react";

// ==================== STYLES ====================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 100%; height: 100%;
    color: #ffffff;
    font-family: 'Arial', 'Helvetica Neue', sans-serif;
    font-size: 16px; line-height: 1.6; overflow-x: hidden;
  }

  :root {
    --primary-orange: #FF6B35;
    --dark-navy: #1a1a2e;
    --light-text: #f5f5f5;
    --accent-dark: #16213e;
    --secondary-orange: #ff8555;
  }

  .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }

  .header {
    position: sticky; top: 0; z-index: 100; padding: 20px 0;
    border-bottom: none; transition: background 0.4s ease, color 0.4s ease;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1e 100%);
  }
  .header-dark {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1e 100%) !important;
    border-bottom: none;
  }
  .header-light {
    background: linear-gradient(135deg, #FF6B35 0%, #FF6B35 100%) !important;
    border-bottom: none;
  }

  .navbar { display: flex; justify-content: space-between; align-items: center; gap: 40px; }

  .logo-text {
    font-size: 18px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; font-family: 'Pixelify Sans', sans-serif;
    transition: color 0.3s ease;
  }
  .header-dark .logo-text { color: rgba(255,255,255,0.9) !important; }
  .header-light .logo-text { color: var(--dark-navy) !important; }

  .nav-text {
    font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; transition: color 0.3s ease;
  }
  .header-dark .nav-text { color: rgba(255,255,255,0.8) !important; }
  .header-light .nav-text { color: var(--dark-navy) !important; }

  .nav-center { position: absolute; left: 50%; transform: translateX(-50%); }
  .header-light .nav-center { position: static; flex: 1; text-align: center; }
  .nav-right { text-align: right; }

  .hero {
    width: 100%; display: flex; align-items: center;
    justify-content: center; position: relative;
  }
  .hero-dark {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1e 100%);
    width: 100%; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding-top: 80px; position: relative; overflow: hidden;
  }
  .hero-dark::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-light {
    background: linear-gradient(135deg, var(--primary-orange) 0%, #ff7f50 100%);
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: space-between; padding: 80px 0 40px 0;
    position: relative; overflow: hidden;
  }

  .hero-background {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 100%; height: 100%; pointer-events: none;
  }
  .circle { position: absolute; border-radius: 50%; opacity: 0.15; }
  .circle-top {
    width: 600px; height: 600px; top: -150px; left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
    border: 1px solid rgba(0,0,0,0.05);
  }

  .hero-content {
    text-align: center; z-index: 2; width: 100%; position: relative; flex: 1;
  }
  .hero-title {
    font-size: 120px; font-weight: 700;
    font-family: "Pixelify Sans", sans-serif;
    letter-spacing: 8px; text-transform: uppercase;
    margin-bottom: 80px; animation: fadeInScale 0.8s ease-out;
  }
  .hero-dark .hero-title { color: #ffffff; text-shadow: 0 0 30px rgba(255,255,255,0.1); }
  .hero-light .hero-title {
    color: var(--dark-navy); text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    font-size: 96px; letter-spacing: 3px; line-height: 1.1;
  }
  .hero-title-wrapper { text-align: center; margin: 60px 0 120px 0; }

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(30px); }
  }
  @keyframes ripple { to { transform: scale(4); opacity: 0; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-info {
    display: flex; justify-content: space-between; align-items: flex-start;
    max-width: 1000px; margin: 0 auto; gap: 100px;
  }
  .hero-light .hero-info {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 60px; align-items: flex-start; margin: 80px 0;
  }
  .info-left { text-align: left; flex: 1; }
  .info-right { text-align: right; flex: 1; display: flex; flex-direction: column; align-items: flex-end; }
  .hero-light .info-left, .hero-light .info-right { padding: 20px; }

  .info-label {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .hero-dark .info-label { color: rgba(255,255,255,0.6); }
  .hero-light .info-label { color: var(--dark-navy); font-weight: 700; margin-bottom: 15px; display: block; }

  .info-text { font-size: 13px; font-weight: 400; line-height: 1.8; max-width: 300px; }
  .hero-dark .info-text { color: rgba(255,255,255,0.7); }
  .hero-light .info-text { color: var(--dark-navy); font-size: 14px; letter-spacing: 0.5px; }

  .explore-btn {
    width: 50px; height: 50px; border-radius: 50%; background: transparent;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease; position: relative; border: 1px solid rgba(255,255,255,0.3);
  }
  .hero-dark .explore-btn { border: 1px solid rgba(255,255,255,0.3); }
  .hero-dark .explore-btn:hover { border-color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
  .hero-light .explore-btn { width: 60px; height: 60px; border: 2px solid var(--dark-navy); margin-top: 20px; }
  .hero-light .explore-btn:hover { background-color: var(--dark-navy); transform: scale(1.1); }

  .circle-btn {
    width: 8px; height: 8px; background-color: #ffffff;
    border-radius: 50%; display: block; transition: all 0.3s ease;
  }
  .hero-dark .circle-btn { background-color: #ffffff; }
  .hero-light .circle-btn { width: 20px; height: 20px; background-color: var(--dark-navy); }
  .hero-light .explore-btn:hover .circle-btn { background-color: var(--primary-orange); transform: scale(1.2); }

  .hero-bottom {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
    padding: 60px 0; position: relative; z-index: 10; margin-top: 60px;
  }
  .hero-light .hero-bottom { border-top: 1px solid rgba(26,26,46,0.2); }

  .bottom-section { display: flex; gap: 30px; align-items: flex-start; transition: all 0.3s ease; }
  .bottom-section:hover { transform: translateY(-5px); }
  .section-icon { font-size: 24px; flex-shrink: 0; margin-top: 5px; font-weight: bold; transition: all 0.3s ease; }
  .hero-light .section-icon { color: var(--dark-navy); }
  .bottom-section:hover .section-icon { transform: scale(1.2) rotate(45deg); }

  .section-content h3 {
    font-family: 'Pixelify Sans', sans-serif; font-size: 18px; letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 12px; font-weight: 700;
  }
  .hero-light .section-content h3 { color: var(--dark-navy); }
  .section-content p { font-size: 12px; line-height: 1.7; letter-spacing: 0.3px; }
  .hero-light .section-content p { color: var(--dark-navy); }

  .modal {
    display: none; position: fixed; z-index: 1000; left: 0; top: 0;
    width: 100%; height: 100%; background-color: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;
  }
  .modal.active { display: flex; align-items: center; justify-content: center; }
  .modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2);
    width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    position: relative; animation: slideUp 0.3s ease;
  }
  .modal-content h2 { font-size: 24px; font-weight: 700; margin-bottom: 30px; letter-spacing: 2px; color: #ffffff; }
  .close {
    position: absolute; right: 20px; top: 20px; font-size: 28px; font-weight: bold;
    color: rgba(255,255,255,0.7); cursor: pointer; transition: color 0.2s; background: none; border: none;
  }
  .close:hover { color: #ffffff; }

  .form-group { margin-bottom: 20px; }
  .form-group label {
    display: block; margin-bottom: 8px; font-size: 12px; font-weight: 600;
    letter-spacing: 1px; color: rgba(255,255,255,0.8); text-transform: uppercase;
  }
  .form-group input {
    width: 100%; padding: 12px 15px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2); border-radius: 5px;
    color: #ffffff; font-size: 14px; transition: all 0.3s ease;
  }
  .form-group input:focus {
    outline: none; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5);
  }
  .form-group input::placeholder { color: rgba(255,255,255,0.3); }

  .auth-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.3); border-radius: 5px;
    color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;
    cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; margin-top: 10px;
  }
  .auth-btn:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    border-color: rgba(255,255,255,0.5);
  }
  .auth-link { text-align: center; margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.6); }
  .auth-link a { color: rgba(255,255,255,0.9); text-decoration: none; cursor: pointer; transition: color 0.2s; }
  .auth-link a:hover { color: #ffffff; }

  .floating-buttons {
    position: fixed; bottom: 30px; right: 30px;
    display: flex; flex-direction: column; gap: 12px; z-index: 50;
  }
  .float-btn {
    padding: 12px 24px; border-radius: 25px; font-size: 12px; font-weight: 600;
    letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;
    text-transform: uppercase; backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.4);
  }
  .signup-btn {
    background: linear-gradient(135deg, var(--primary-orange) 0%, #ff7f50 100%);
    color: #ffffff; border: 1px solid rgba(255,107,53,0.6);
  }
  .signup-btn:hover {
    background: linear-gradient(135deg, #ff8555 0%, #ff7f50 100%);
    border-color: rgba(255,107,53,0.9); transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255,107,53,0.3);
  }
  .signin-btn {
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.4);
  }
  .signin-btn:hover {
    background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.8);
    color: #ffffff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,255,255,0.2);
  }

  .notification {
    position: fixed; top: 20px; right: 20px; padding: 15px 25px;
    color: white; border-radius: 8px; font-size: 14px; z-index: 2000;
    animation: slideInRight 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-family: 'Space Mono', monospace; max-width: 300px;
  }

  @media (max-width: 768px) {
    .container { padding: 0 20px; }
    .navbar { flex-direction: column; gap: 15px; }
    .nav-center { position: static; transform: none; }
    .nav-right { text-align: center; }
    .hero-title { font-size: 60px; letter-spacing: 4px; margin-bottom: 40px; }
    .hero-light .hero-title { font-size: 48px; letter-spacing: 2px; }
    .hero-info { flex-direction: column; gap: 40px; }
    .hero-light .hero-info { grid-template-columns: 1fr; gap: 40px; margin: 40px 0; }
    .info-left, .info-right { text-align: center; align-items: center; }
    .info-text { max-width: 100%; }
    .hero-bottom { grid-template-columns: 1fr; gap: 40px; padding: 40px 0; }
    .floating-buttons { flex-direction: row; bottom: 20px; right: 20px; left: 20px; justify-content: flex-end; gap: 8px; }
    .float-btn { padding: 10px 16px; font-size: 11px; }
    .modal-content { width: 90%; margin: 20px; padding: 30px; }
    .hero-title-wrapper { margin: 40px 0 60px 0; }
    .hero-light .hero-title-wrapper { margin: 30px 0 40px 0; }
  }
  @media (max-width: 480px) {
    .hero-title { font-size: 40px; letter-spacing: 2px; margin-bottom: 30px; }
    .hero-light .hero-title { font-size: 32px; }
    .nav-text { display: none; }
    .logo-text { font-size: 14px; }
    .info-label, .info-text { font-size: 12px; }
    .hero-light .info-label { font-size: 10px; }
    .hero-light .info-text { font-size: 12px; }
    .section-content h3 { font-size: 14px; }
    .section-content p { font-size: 11px; }
    .float-btn { padding: 8px 12px; font-size: 10px; }
  }
`;

// ==================== TYPES ====================
type ModalId = "signup" | "signin";

interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

// ==================== COMPONENT ====================
export default function Page() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "info",
    visible: false,
  });
  const [headerClass, setHeaderClass] = useState("header-dark");

  // Form state
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });
  const [signinForm, setSigninForm] = useState({ emailOrUsername: "", password: "" });

  const showNotification = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 3000);
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
    showNotification("Account created successfully! Welcome to VRTL WRLD.", "success");
    setSignupForm({ username: "", email: "", password: "" });
    setTimeout(closeModal, 1500);
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    const { emailOrUsername, password } = signinForm;
    if (!emailOrUsername || !password) return showNotification("Please fill in all fields", "error");
    if (password.length < 6) return showNotification("Password must be at least 6 characters", "error");
    showNotification("Welcome back to VRTL WRLD!", "success");
    setSigninForm({ emailOrUsername: "", password: "" });
    setTimeout(closeModal, 1500);
  };

  // Scroll listener for header color change
  useEffect(() => {
    const handleScroll = () => {
      const lightSection = document.querySelector(".hero-light");
      if (lightSection) {
        const rect = lightSection.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 0) {
          setHeaderClass("header-light");
        } else {
          setHeaderClass("header-dark");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const notifBg =
    notification.type === "success" ? "#4CAF50" : notification.type === "error" ? "#f44336" : "#2196F3";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* ========== HEADER ========== */}
      <header className={`header ${headerClass}`}>
        <div className="container">
          <div className="navbar">
            <div className="logo">
              <span className="logo-text">VRTL WRLD</span>
            </div>
            <div className="nav-center">
              <span className="nav-text">[ S ]</span>
            </div>
            <div className="nav-right">
              <span className="nav-text">IMAGE TREATMENTS</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========== HERO DARK ========== */}
      <section className="hero hero-dark">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">METAVERSE</h1>
            <div className="hero-info">
              <div className="info-left">
                <p className="info-label">ABOUT US</p>
                <p className="info-text">
                  Enter any bad despond and figure winter. Change stars and their body wisdom new happen prepare its.
                  Now taken him limited see world get.
                </p>
              </div>
              <div className="info-right">
                <p className="info-label">Get a Demo</p>
                <a href="/meta">
                  <button className="explore-btn">
                    <span className="circle-btn"></span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HERO LIGHT ========== */}
      <section className="hero hero-light">
        <div className="hero-background">
          <div className="circle circle-top"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-title-wrapper">
              <h1 className="hero-title">
                ACROSS PHYSICAL
                <br />
                &amp; VIRTUAL
                <br />
                REALMS
              </h1>
            </div>
            <div className="hero-info">
              <div className="info-left">
                <p className="info-label">ABOUT US</p>
                <p className="info-text">
                  VRTL WRLD creates exceptional web3 and metaverse experiences that future-proof your brand and
                  captures community using comprehensive strategy, high quality production and ongoing support.
                </p>
              </div>
              <div className="info-spacer"></div>
              <div className="info-right">
                <p className="info-label">EXPLORE OUR SPACES</p>
                <a href="/space">
                  <button className="explore-btn">
                    <span className="circle-btn"></span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="bottom-section">
            <div className="section-icon">⊙</div>
            <div className="section-content">
              <h3>STRATEGY</h3>
              <p>
                Our strategic approach blends innovation with market insights. We develop comprehensive roadmaps that
                align your vision with industry trends, ensuring your metaverse presence stands out.
              </p>
            </div>
          </div>
          <div className="bottom-section">
            <div className="section-icon">⊙</div>
            <div className="section-content">
              <h3>PRODUCTION</h3>
              <p>
                High-quality production defines our work. From 3D asset creation to immersive world-building, we
                deliver stunning visual experiences that captivate and engage your audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SIGN UP MODAL ========== */}
      <div
        id="signupModal"
        className={`modal ${activeModal === "signup" ? "active" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="modal-content">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <h2>Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={signupForm.username}
                onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>
          <p className="auth-link">
            Already have an account?{" "}
            <a onClick={() => switchModal("signin")}>Sign In</a>
          </p>
        </div>
      </div>

      {/* ========== SIGN IN MODAL ========== */}
      <div
        id="signinModal"
        className={`modal ${activeModal === "signin" ? "active" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="modal-content">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <h2>Welcome Back</h2>
          <form onSubmit={handleSignin}>
            <div className="form-group">
              <label>Email or Username</label>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={signinForm.emailOrUsername}
                onChange={(e) => setSigninForm({ ...signinForm, emailOrUsername: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={signinForm.password}
                onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="auth-btn">
              Sign In
            </button>
          </form>
          <p className="auth-link">
            Don&apos;t have an account?{" "}
            <a onClick={() => switchModal("signup")}>Sign Up</a>
          </p>
        </div>
      </div>

      {/* ========== FLOATING BUTTONS ========== */}
      <div className="floating-buttons">
        <button className="float-btn signup-btn" onClick={() => openModal("signup")}>
          Sign Up
        </button>
        <button className="float-btn signin-btn" onClick={() => openModal("signin")}>
          Sign In
        </button>
      </div>

      {/* ========== NOTIFICATION ========== */}
      {notification.visible && (
        <div
          className="notification"
          style={{ backgroundColor: notifBg }}
        >
          {notification.message}
        </div>
      )}
    </>
  );
}