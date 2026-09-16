"use client";

import { useState, useEffect } from "react";

// ==================== SHARED BASE STYLES (from style.css) ====================
const baseStyles = `
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

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.7); }
    50% { box-shadow: 0 0 0 10px rgba(255,107,53,0); }
  }
`;

// ==================== SPACES PAGE SPECIFIC STYLES ====================
const spaceStyles = `
  body {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1e 100%);
  }

  .spaces-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background: rgba(10,10,10,0.8); backdrop-filter: blur(10px);
  }
  .spaces-nav {
    max-width: 1400px; margin: 0 auto; padding: 0 40px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .back-btn {
    display: inline-block; padding: 10px 20px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.3); border-radius: 5px;
    color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600;
    letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase;
  }
  .back-btn:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
    border-color: rgba(255,255,255,0.5);
  }
  .spaces-title {
    font-size: 14px; font-weight: 600; letter-spacing: 2px;
    color: rgba(255,255,255,0.8); text-transform: uppercase;
  }

  .spaces-container { max-width: 1600px; margin: 0 auto; padding: 120px 40px 60px; }

  .spaces-hero { text-align: center; margin-bottom: 80px; }
  .spaces-hero h1 {
    font-size: 72px; font-weight: 700; font-family: "Pixelify Sans", sans-serif;
    letter-spacing: 5px; color: #ffffff; margin-bottom: 20px;
    text-shadow: 0 0 30px rgba(255,107,53,0.2);
  }
  .spaces-hero p {
    font-size: 16px; color: rgba(255,255,255,0.7); max-width: 600px;
    margin: 0 auto 30px; line-height: 1.8;
  }

  .map-container {
    position: relative; width: 100%; max-width: 1200px; margin: 0 auto 60px;
    background: rgba(255,255,255,0.02); border: 2px solid rgba(255,107,53,0.3);
    border-radius: 15px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    transition: all 0.3s ease;
  }
  .map-container:hover { border-color: rgba(255,107,53,0.6); box-shadow: 0 30px 80px rgba(255,107,53,0.2); }
  .map-image { width: 100%; height: auto; display: block; cursor: pointer; transition: transform 0.3s ease; }
  .map-image:hover { transform: scale(1.02); }
  .map-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }

  .hotspot {
    position: absolute; width: 50px; height: 50px;
    background: radial-gradient(circle, rgba(255,107,53,0.8), rgba(255,107,53,0.3));
    border: 2px solid rgba(255,107,53,0.9); border-radius: 50%;
    cursor: pointer; pointer-events: auto; transition: all 0.3s ease;
    display: flex; align-items: center; justify-content: center;
    font-weight: bold; color: white; font-size: 12px; animation: pulse 2s infinite;
    transform: translate(-50%, -50%);
  }
  .hotspot:hover {
    width: 70px; height: 70px;
    background: radial-gradient(circle, rgba(255,107,53,1), rgba(255,107,53,0.5));
    box-shadow: 0 0 20px rgba(255,107,53,0.8);
  }

  .areas-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px; margin-top: 80px;
  }
  .area-card {
    background: linear-gradient(135deg, rgba(255,107,53,0.1), rgba(26,26,46,0.3));
    border: 1px solid rgba(255,107,53,0.3); border-radius: 10px; padding: 30px;
    transition: all 0.3s ease; cursor: pointer; position: relative; overflow: hidden;
  }
  .area-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at top right, rgba(255,107,53,0.1), transparent);
    pointer-events: none;
  }
  .area-card:hover {
    background: linear-gradient(135deg, rgba(255,107,53,0.2), rgba(26,26,46,0.4));
    border-color: rgba(255,107,53,0.6); transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255,107,53,0.2);
  }
  .area-card-icon { font-size: 40px; margin-bottom: 15px; }
  .area-card h3 {
    font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px;
    letter-spacing: 1px; text-transform: uppercase; font-family: 'Pixelify Sans', sans-serif;
  }
  .area-card p { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 20px; }
  .area-badge {
    display: inline-block; padding: 6px 12px; background: rgba(255,107,53,0.3);
    border: 1px solid rgba(255,107,53,0.6); border-radius: 20px;
    font-size: 11px; color: rgba(255,107,53,0.9); text-transform: uppercase;
    letter-spacing: 1px; font-weight: 600;
  }

  .features-section {
    margin-top: 100px; padding: 60px;
    background: linear-gradient(135deg, rgba(255,107,53,0.05), rgba(26,26,46,0.2));
    border: 1px solid rgba(255,107,53,0.2); border-radius: 15px;
  }
  .features-section h2 {
    font-size: 36px; font-weight: 700; font-family: 'Pixelify Sans', sans-serif;
    letter-spacing: 2px; color: #ffffff; margin-bottom: 40px;
    text-align: center; text-transform: uppercase;
  }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
  .feature-item {
    text-align: center; padding: 30px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,107,53,0.2); border-radius: 10px; transition: all 0.3s ease;
  }
  .feature-item:hover {
    background: rgba(255,107,53,0.1); border-color: rgba(255,107,53,0.5); transform: translateY(-5px);
  }
  .feature-item-icon { font-size: 36px; margin-bottom: 15px; }
  .feature-item h3 {
    font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 10px;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .feature-item p { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.6; }

  .cta-section {
    text-align: center; margin-top: 80px; padding: 60px;
    background: linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05));
    border: 2px solid rgba(255,107,53,0.4); border-radius: 15px;
  }
  .cta-section h2 {
    font-size: 32px; font-weight: 700; font-family: 'Pixelify Sans', sans-serif;
    color: #ffffff; margin-bottom: 20px; letter-spacing: 2px;
  }
  .cta-section p {
    font-size: 15px; color: rgba(255,255,255,0.7); margin-bottom: 30px;
    max-width: 500px; margin-left: auto; margin-right: auto;
  }
  .cta-btn {
    display: inline-block; padding: 14px 40px;
    background: linear-gradient(135deg, var(--primary-orange), #ff8555);
    border: none; border-radius: 5px; color: white; font-size: 14px;
    font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.3s ease;
    text-transform: uppercase; font-family: 'Pixelify Sans', sans-serif;
  }
  .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(255,107,53,0.4); }

  .modal-overlay {
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9); z-index: 1000; align-items: center;
    justify-content: center; backdrop-filter: blur(5px); animation: fadeIn 0.3s ease;
  }
  .modal-overlay.active { display: flex; }
  .area-modal {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 40px; border-radius: 10px; border: 1px solid rgba(255,107,53,0.4);
    max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    position: relative; animation: slideUp 0.3s ease;
  }
  .area-modal-close {
    position: absolute; top: 20px; right: 20px; font-size: 28px; font-weight: bold;
    color: rgba(255,255,255,0.7); cursor: pointer; transition: color 0.2s;
    background: none; border: none;
  }
  .area-modal-close:hover { color: #ffffff; }
  .area-modal h2 { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 15px; letter-spacing: 1px; }
  .area-modal p { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 20px; }
  .area-modal-features { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
  .modal-feature {
    padding: 12px; background: rgba(255,107,53,0.1);
    border-left: 3px solid rgba(255,107,53,0.6); border-radius: 3px;
  }
  .modal-feature strong {
    color: rgba(255,107,53,0.9); display: block; margin-bottom: 5px;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .modal-feature span { color: rgba(255,255,255,0.7); font-size: 12px; }

  @media (max-width: 768px) {
    .spaces-container { padding: 100px 20px 40px; }
    .spaces-hero h1 { font-size: 40px; letter-spacing: 2px; }
    .areas-grid { grid-template-columns: 1fr; }
    .features-section, .cta-section { padding: 30px; }
    .features-section h2, .cta-section h2 { font-size: 24px; }
    .feature-item { padding: 20px; }
    .hotspot { width: 40px; height: 40px; font-size: 10px; }
    .hotspot:hover { width: 55px; height: 55px; }
  }
`;

// ==================== AREA DATA ====================
const areaData: Record<
  string,
  { title: string; description: string; icon: string; badge: string; features: { label: string; value: string }[] }
> = {
  conference: {
    title: "Conference Room",
    icon: "🏛️",
    badge: "Premium Space",
    description:
      "Our premier conference room is equipped with cutting-edge presentation technology, high-definition displays, and professional audio-visual systems.",
    features: [
      { label: "Capacity", value: "20-30 People" },
      { label: "Technology", value: "4K Displays" },
      { label: "Availability", value: "24/7 Access" },
      { label: "Amenities", value: "Catering Service" },
    ],
  },
  meeting: {
    title: "Meeting Hall",
    icon: "🤝",
    badge: "Large Format",
    description:
      "Spacious hall designed for large gatherings, workshops, and strategic planning sessions with flexible modular seating.",
    features: [
      { label: "Capacity", value: "50-100 People" },
      { label: "Configuration", value: "Modular Setup" },
      { label: "Acoustics", value: "Professional Grade" },
      { label: "Climate", value: "Smart Control" },
    ],
  },
  workspace: {
    title: "Dev Workspace",
    icon: "💻",
    badge: "Tech Hub",
    description:
      "Modern development environment featuring high-performance workstations, advanced networking infrastructure, and power-user amenities.",
    features: [
      { label: "Workstations", value: "15+ Stations" },
      { label: "Speed", value: "1Gbps Fiber" },
      { label: "Monitor Setup", value: "Dual 4K" },
      { label: "Support", value: "Tech Team On-site" },
    ],
  },
  creative: {
    title: "Creative Studio",
    icon: "🎨",
    badge: "Design Lab",
    description:
      "Inspiring collaborative space for designers and creative professionals with inspirational design and professional-grade tools.",
    features: [
      { label: "Workstations", value: "10+ Desks" },
      { label: "Software", value: "Creative Suite" },
      { label: "Display", value: "Reference Displays" },
      { label: "Collaboration", value: "Whiteboard Wall" },
    ],
  },
  lounge: {
    title: "Lounge Area",
    icon: "☕",
    badge: "Relax Zone",
    description:
      "Comfortable relaxation zone offering premium seating, refreshments, and a casual environment for informal networking.",
    features: [
      { label: "Seating", value: "Premium Comfort" },
      { label: "Refreshments", value: "Premium Beverages" },
      { label: "Atmosphere", value: "Casual & Welcoming" },
      { label: "WiFi", value: "High-Speed Available" },
    ],
  },
  cafeteria: {
    title: "Cafeteria",
    icon: "🍽️",
    badge: "Full Service",
    description:
      "Full-service dining facility providing gourmet meals, healthy options, and specialty beverages throughout the day.",
    features: [
      { label: "Cuisine", value: "Diverse Menu" },
      { label: "Dietary", value: "All Preferences" },
      { label: "Seating", value: "80+ Seats" },
      { label: "Hours", value: "7AM - 7PM" },
    ],
  },
};

// Hotspot positions
const hotspots = [
  { key: "conference", label: "C", top: "15%", left: "20%", title: "Conference Room" },
  { key: "meeting", label: "M", top: "25%", left: "45%", title: "Meeting Hall" },
  { key: "workspace", label: "W", top: "35%", left: "60%", title: "Dev Workspace" },
  { key: "creative", label: "A", top: "50%", left: "25%", title: "Creative Studio" },
  { key: "lounge", label: "L", top: "60%", left: "55%", title: "Lounge Area" },
  { key: "cafeteria", label: "F", top: "75%", left: "40%", title: "Cafeteria" },
];

// Features list
// const features = [
//   { icon: "🌐", title: "Web3 Ready", desc: "Fully integrated with blockchain and NFT ecosystems." },
//   { icon: "🥽", title: "VR Compatible", desc: "Experience every space in full virtual reality." },
//   { icon: "⚡", title: "High Performance", desc: "Enterprise-grade infrastructure built for scale." },
//   { icon: "🔒", title: "Secure Access", desc: "Multi-factor authentication and encrypted sessions." },
// ];

// ==================== COMPONENT ====================
export default function Space() {
  const [activeArea, setActiveArea] = useState<string | null>(null);

  const openAreaModal = (areaKey: string) => setActiveArea(areaKey);
  const closeAreaModal = () => setActiveArea(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAreaModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const selectedArea = activeArea ? areaData[activeArea] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: baseStyles + spaceStyles }} />

      {/* ========== HEADER ========== */}
      <header className="spaces-header">
        <div className="spaces-nav">
          <a href="/" className="back-btn">
            ← Back to Home
          </a>
          <span className="spaces-title">OUR SPACES</span>
          <div style={{ width: 80 }}></div>
        </div>
      </header>

      {/* ========== MAIN CONTAINER ========== */}
      <div className="spaces-container">

        {/* Hero */}
        <section className="spaces-hero">
          <h1>Explore Our Spaces</h1>
          <p>
            Welcome to VRTL WRLD&apos;s immersive office environment. Discover collaborative zones, innovation hubs, and
            cutting-edge facilities designed for web3 excellence.
          </p>
        </section>

        {/* Map with Hotspots */}
        <div className="map-container">
          <img
            src="/office-Map.png"
            alt="Office Map"
            className="map-image"
          />
          <div className="map-overlay">
            {hotspots.map((spot) => (
              <div
                key={spot.key}
                className="hotspot"
                style={{ top: spot.top, left: spot.left }}
                title={spot.title}
                onClick={() => openAreaModal(spot.key)}
              >
                {spot.label}
              </div>
            ))}
          </div>
        </div>

        {/* Area Cards Grid
        <div className="areas-grid">
          {Object.entries(areaData).map(([key, area]) => (
            <div key={key} className="area-card" onClick={() => openAreaModal(key)}>
              <div className="area-card-icon">{area.icon}</div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span className="area-badge">{area.badge}</span>
            </div>
          ))}
        </div> */}

        {/* Features Section */}
        {/* <div className="features-section">
          <h2>Platform Features</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-item-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Enter?</h2>
          <p>
            Join thousands of creators, developers, and innovators already building in VRTL WRLD&apos;s metaverse
            ecosystem.
          </p>
          <button className="cta-btn" onClick={() => (window.location.href = "/meta")}>
            Get Started
          </button>
        </div>
      </div>

      {/* ========== AREA MODAL ========== */}
      <div
        id="areaModal"
        className={`modal-overlay ${activeArea ? "active" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeAreaModal()}
      >
        {selectedArea && (
          <div className="area-modal">
            <button className="area-modal-close" onClick={closeAreaModal}>
              &times;
            </button>
            <h2 id="modalTitle">{selectedArea.title}</h2>
            <p id="modalDescription">{selectedArea.description}</p>
            <div className="area-modal-features" id="modalFeatures">
              {selectedArea.features.map((feat, i) => (
                <div key={i} className="modal-feature">
                  <strong>{feat.label}</strong>
                  <span>{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}