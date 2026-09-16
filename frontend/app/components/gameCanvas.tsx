"use client";

import { useEffect, useRef, useState } from "react";
import MainSceneClass from "../game/mainScene";
import ChatOverlay from "./ChatOverlay";

interface PlayerTag {
  id: string;
  name: string;
  color: string;
  screenX: number;
  screenY: number;
  isMe: boolean;
}

export default function GameCanvas({ socket }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearbyPlayerIds, setNearbyPlayerIds] = useState<string[]>([]);
  const [playerTags, setPlayerTags] = useState<PlayerTag[]>([]);

  useEffect(() => {
    if (!socket) return;
    const container = containerRef.current;
    if (!container) return;
    if (container.querySelector("canvas")) return;

    let game: any = null;

    const initGame = async () => {
      const PhaserModule = await import("phaser");
      const Phaser = PhaserModule.default ?? PhaserModule;
      if (container.querySelector("canvas")) return;

      class PhaserScene extends Phaser.Scene {
        mainScene: any;
        constructor() { super("MainScene"); }

        preload() {
          this.load.tilemapTiledJSON("map", "/maps/map.json");
          this.load.image("Wood", "/tiles/Wood.png");
          this.load.image("gather_floors_4.1", "/tiles/gather_floors_4.1.png");
          this.load.image("gather_floors_1.5", "/tiles/gather_floors_1.5.png");
          this.load.image("furniture", "/tiles/furniture.png");
          this.load.image("decor", "/tiles/decor.png");
          this.load.image("gather_decoration_exterior_1.3", "/tiles/gather_decoration_exterior_1.3.png");
          this.load.image("p1", "/tiles/p1.png");
          this.load.image("s1", "/tiles/s1.png");
          this.load.image("s0", "/tiles/s0.png");
          this.load.image("g", "/tiles/g.png");
          this.load.spritesheet("avatar", "/tiles/char_Boy1.png", {
            frameWidth: 32,
            frameHeight: 48,
          });
        }

        init(data: any) {
          this.mainScene = new MainSceneClass(this);
          this.mainScene.init(data);
          this.mainScene.onNearbyPlayersChange = (ids: string[]) => {
            setNearbyPlayerIds(ids);
          };
          this.mainScene.onPlayersUpdate = (players: PlayerTag[]) => {
            setPlayerTags(players);
          };
        }

        create() { this.mainScene.create(); }
        update() { this.mainScene.update(); }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: container,
        physics: { default: "arcade", arcade: { debug: false } },
        scene: PhaserScene,
        render: { pixelArt: true, antialias: false, roundPixels: true },
      });

      game.scene.start("MainScene", { socket });
    };

    initGame();
    return () => { game?.destroy(true); };
  }, [socket]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />

      {/* ── HTML Name Tags — always crisp, rendered outside Phaser canvas ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {playerTags.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.screenX,
              top: p.screenY - 72,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px 3px 7px",
              borderRadius: 999,
              background: "rgba(15, 15, 28, 0.82)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {/* Colored dot */}
            <span style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 5px ${p.color}88`,
              flexShrink: 0,
            }} />
            {/* Name */}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: p.isMe ? "#fff" : "rgba(255,255,255,0.85)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.02em",
            }}>
              {p.isMe ? `${p.name} (you)` : p.name}
            </span>
          </div>
        ))}
      </div>

      <ChatOverlay socket={socket} nearbyPlayerIds={nearbyPlayerIds} />
    </div>
  );
}