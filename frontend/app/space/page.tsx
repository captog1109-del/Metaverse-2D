"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import glass from "../styles/glass.module.css";
import s from "./space.module.css";

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

// Hotspot positions (percent of the map image) — unchanged from the previous design
const hotspots = [
  { key: "conference", label: "C", top: "15%", left: "20%", title: "Conference Room" },
  { key: "meeting", label: "M", top: "25%", left: "45%", title: "Meeting Hall" },
  { key: "workspace", label: "W", top: "35%", left: "60%", title: "Dev Workspace" },
  { key: "creative", label: "A", top: "50%", left: "25%", title: "Creative Studio" },
  { key: "lounge", label: "L", top: "60%", left: "55%", title: "Lounge Area" },
  { key: "cafeteria", label: "F", top: "75%", left: "40%", title: "Cafeteria" },
];

// ==================== COMPONENT ====================
export default function Space() {
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [mapFailed, setMapFailed] = useState(false);

  const openAreaModal = (areaKey: string) => setActiveArea(areaKey);
  const closeAreaModal = () => setActiveArea(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveArea(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const selectedArea = activeArea ? areaData[activeArea] : null;

  return (
    <div className={glass.ambient}>
      {/* ========== HEADER ========== */}
      <SiteHeader
        active="spaces"
        actions={
          <>
            <Link href="/" className={`${glass.btn} ${glass.btnNeutral}`} style={{ height: 44 }}>
              Back to home
            </Link>
            <Link href="/meta" className={`${glass.btn} ${glass.btnPrimary}`} style={{ height: 44 }}>
              Enter workspace
            </Link>
          </>
        }
      />

      <main className={s.main}>
        {/* Hero */}
        <section className={s.hero}>
          <h1 className={s.title}>Explore our spaces</h1>
          <p className={s.lede}>
            Welcome to Metaverse 2D&apos;s office. Discover collaborative zones, innovation hubs, and
            cutting-edge facilities for your team.
          </p>
        </section>

        {/* Map with hotspots */}
        <section className={`${glass.glass} ${s.mapFrame}`} aria-label="Office map">
          {mapFailed ? (
            <div className={`${s.map} ${s.mapError}`} role="alert">
              <p className={s.mapErrorTitle}>The office map didn&apos;t load</p>
              <p className={s.mapErrorText}>
                Check your connection and reload the page. You can still browse every room from the list below.
              </p>
              <button
                type="button"
                className={`${glass.btn} ${glass.btnPrimary}`}
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          ) : (
            <div className={s.map}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/office-Map.png"
                alt="Office map"
                className={s.mapImage}
                onError={() => setMapFailed(true)}
              />
              <div className={s.hotspots}>
                {hotspots.map((spot) => (
                  <button
                    type="button"
                    key={spot.key}
                    className={s.hotspot}
                    style={{ top: spot.top, left: spot.left }}
                    title={spot.title}
                    aria-label={spot.title}
                    onClick={() => openAreaModal(spot.key)}
                  >
                    {spot.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className={s.mapHint}>Select a marker to see what&apos;s in each room.</p>
        </section>

        {/* Room list */}
        <h2 className={s.areasTitle}>All rooms</h2>
        <ul className={s.areas}>
          {hotspots.map((spot) => (
            <li key={spot.key}>
              <button type="button" className={s.area} onClick={() => openAreaModal(spot.key)}>
                <span className={s.areaKey} aria-hidden="true">{spot.label}</span>
                <span>
                  <span className={s.areaName}>{spot.title}</span>
                  <span className={s.areaBadge}>{areaData[spot.key].badge}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <section className={`${glass.glass} ${s.cta}`}>
          <h2 className={s.ctaTitle}>Ready to enter?</h2>
          <p className={s.ctaText}>
            Step into the office, walk up to a teammate, and start a conversation in real time.
          </p>
          <Link href="/meta" className={`${glass.btn} ${glass.btnPrimary}`}>
            Get started
          </Link>
        </section>
      </main>

      <SiteFooter />

      {/* ========== AREA DIALOG ========== */}
      {selectedArea && (
        <div
          className={s.overlay}
          onClick={(e) => e.target === e.currentTarget && closeAreaModal()}
        >
          <div className={`${glass.glassStrong} ${s.dialog}`} role="dialog" aria-modal="true" aria-labelledby="areaTitle">
            <button type="button" className={s.close} onClick={closeAreaModal} aria-label="Close" autoFocus>
              &times;
            </button>
            <h2 id="areaTitle" className={s.dialogTitle}>{selectedArea.title}</h2>
            <p className={s.dialogText}>{selectedArea.description}</p>
            <div className={s.facts}>
              {selectedArea.features.map((feat, i) => (
                <div key={i} className={s.fact}>
                  <span className={s.factLabel}>{feat.label}</span>
                  <span className={s.factValue}>{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
