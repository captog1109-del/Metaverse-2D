"use client";

export default class MainScene {
  scene: any;
  socket: any;

  players: Record<string, any> = {};
  remoteTargets: Record<string, { x: number; y: number; dir: string }> = {};

  me: any = null;
  cursors: any = null;
  colliders: any = null;

  onNearbyPlayersChange?: (ids: string[]) => void;
  onPlayersUpdate?: (players: any[]) => void;
  PROXIMITY_RADIUS = 150;

  private bubbles: Record<string, any> = {};

  constructor(scene: any) {
    this.scene = scene;
  }

  init(data: any) {
    this.socket = data.socket;
  }

  create() {
    const map = this.scene.make.tilemap({ key: "map" });
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    const tilesets = [
      map.addTilesetImage("Wood", "Wood"),
      map.addTilesetImage("gather_floors_4.1", "gather_floors_4.1"),
      map.addTilesetImage("gather_floors_1.5", "gather_floors_1.5"),
      map.addTilesetImage("furniture", "furniture"),
      map.addTilesetImage("decor", "decor"),
      map.addTilesetImage("gather_decoration_1.21", "decor"),
      map.addTilesetImage("mastersheet", "furniture"),
      map.addTilesetImage(
        "gather_decoration_exterior_1.3",
        "gather_decoration_exterior_1.3"
      ),
      map.addTilesetImage("p1", "p1"),
      map.addTilesetImage("s1", "s1"),
      map.addTilesetImage("s0", "s0"),
      map.addTilesetImage("g", "g"),
    ].filter(Boolean);

    map.createLayer("backGround", tilesets, 0, 0);
    map.createLayer("ground", tilesets, 0, 0);
    map.createLayer("carpet", tilesets, 0, 0);
    map.createLayer("furni", tilesets, 0, 0);
    map.createLayer("funiTop", tilesets, 0, 0);

    this.colliders = this.scene.physics.add.staticGroup();
    const collisionObjects = map.getObjectLayer("collision");
    if (collisionObjects) {
      collisionObjects.objects.forEach((obj: any) => {
        const w = Math.max(obj.width || 0, 2);
        const h = Math.max(obj.height || 0, 2);
        const rect = this.scene.add.rectangle(
          obj.x + w / 2,
          obj.y + h / 2,
          w,
          h,
          0x000000,
          0
        );
        this.scene.physics.add.existing(rect, true);
        this.colliders.add(rect);
      });
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.socket.off("init");
    this.socket.on("init", (allPlayers: any) => {
      this.destroyAllPlayers();
      Object.keys(allPlayers).forEach((id) => {
        const p = allPlayers[id];
        if (!p) return;
        this.createPlayer(id, p);
        if (id !== this.socket.id) {
          this.remoteTargets[id] = { x: p.x, y: p.y, dir: p.dir || "down" };
        }
      });
    });

    this.socket.off("players-update");
    this.socket.on("players-update", (allPlayers: any) => {
      Object.keys(allPlayers).forEach((id) => {
        const p = allPlayers[id];
        if (!this.players[id]) {
          this.createPlayer(id, p);
        } else if (id !== this.socket.id) {
          this.remoteTargets[id] = { x: p.x, y: p.y, dir: p.dir || "down" };
        }
      });
      Object.keys(this.players).forEach((id) => {
        if (!allPlayers[id]) {
          this.players[id].sprite?.destroy();
          delete this.players[id];
          delete this.remoteTargets[id];
        }
      });
    });

    this.socket.off("chat");
    this.socket.on(
      "chat",
      ({ id, message }: { id: string; name: string; message: string }) => {
        this.showSpeechBubble(id, message);
      }
    );

    const totalFrames = this.scene.textures.get("avatar").frameTotal - 1;
    if (totalFrames >= 16) {
      const anims = [
        { key: "down", start: 0, end: 3 },
        { key: "right", start: 4, end: 7 },
        { key: "left", start: 8, end: 11 },
        { key: "up", start: 12, end: 15 },
      ];
      anims.forEach(({ key, start, end }) => {
        if (!this.scene.anims.exists(key)) {
          this.scene.anims.create({
            key,
            frames: this.scene.anims.generateFrameNumbers("avatar", { start, end }),
            frameRate: 8,
            repeat: -1,
          });
        }
      });
    }

    this.socket.emit("request-players");
    this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.scene.cameras.main.setZoom(1.5);
  }

  // ─── Speech bubble (Phaser graphics — not text, so no blur issue) ───
  private showSpeechBubble(playerId: string, message: string) {
    const player = this.players[playerId];
    if (!player?.sprite) return;

    if (this.bubbles[playerId]) {
      this.bubbles[playerId].destroy();
      delete this.bubbles[playerId];
    }

    const sprite = player.sprite;
    const isMe = playerId === this.socket.id;
    const maxLen = 60;
    const displayText =
      message.length > maxLen ? message.slice(0, maxLen) + "…" : message;

    const text = this.scene.add.text(0, 0, displayText, {
      fontSize: "9px",
      color: "#ffffff",
      fontFamily: "sans-serif",
      wordWrap: { width: 120, useAdvancedWrap: true },
      align: "center",
      lineSpacing: 2,
      resolution: 4,
    });
    text.setOrigin(0.5, 0.5);

    const tw = text.width;
    const th = text.height;
    const padX = 10, padY = 7;
    const bubbleW = tw + padX * 2;
    const bubbleH = th + padY * 2;
    const tailH = 6;
    const r = 8;

    const gfx = this.scene.add.graphics();

    gfx.fillStyle(0x000000, 0.35);
    gfx.fillRoundedRect(-bubbleW / 2 + 2, -bubbleH / 2 - tailH + 2, bubbleW, bubbleH, r);

    const bgColor = isMe ? 0x1e6fd9 : 0x1a1a2e;
    const borderColor = isMe ? 0x3b9eff : 0x3a3a5c;

    gfx.fillStyle(bgColor, 0.92);
    gfx.fillRoundedRect(-bubbleW / 2, -bubbleH / 2 - tailH, bubbleW, bubbleH, r);
    gfx.lineStyle(1, borderColor, 0.8);
    gfx.strokeRoundedRect(-bubbleW / 2, -bubbleH / 2 - tailH, bubbleW, bubbleH, r);
    gfx.fillStyle(bgColor, 0.92);
    gfx.fillTriangle(-6, -tailH, 6, -tailH, 0, 0);
    gfx.fillRect(-5, -tailH - 1, 10, 3);

    text.setPosition(0, -bubbleH / 2 - tailH + padY + th / 2);

    const offsetY = -(bubbleH + tailH + 64);
    const container = this.scene.add.container(sprite.x, sprite.y + offsetY, [gfx, text]);
    container.setDepth(sprite.y + 100);

    container.setScale(0.5);
    container.setAlpha(0);
    this.scene.tweens.add({
      targets: container,
      scaleX: 1, scaleY: 1, alpha: 1,
      duration: 200,
      ease: "Back.easeOut",
    });

    this.scene.time.delayedCall(4500, () => {
      if (!container.active) return;
      this.scene.tweens.add({
        targets: container,
        alpha: 0,
        y: container.y - 8,
        duration: 400,
        ease: "Sine.easeIn",
        onComplete: () => {
          container.destroy();
          delete this.bubbles[playerId];
        },
      });
    });

    this.bubbles[playerId] = container;
  }

  // ─── Create player — NO name tag here, HTML overlay handles it ───
  private createPlayer(id: string, data: any) {
    const startX = data?.x ?? 400;
    const startY = data?.y ?? 400;
    const isMe = id === this.socket.id;

    const sprite = this.scene.add.sprite(startX, startY, "avatar");
    this.scene.physics.add.existing(sprite);
    sprite.setOrigin(0.5, 1);
    sprite.setScale(1);
    sprite.setDepth(startY);

    const body = sprite.body as any;
    body.setSize(16, 12);
    body.setOffset(8, 34);

    // Store player data for HTML overlay to read
    this.players[id] = { sprite, id, data };

    if (isMe) {
      this.me = sprite;
      body.setCollideWorldBounds(true);
      if (this.colliders) {
        this.scene.physics.add.collider(sprite, this.colliders);
      }
      this.scene.cameras.main.startFollow(sprite, true, 0.1, 0.1);
    } else {
      body.setImmovable(true);
      body.setAllowGravity(false);
      body.setVelocity(0, 0);
      this.remoteTargets[id] = { x: startX, y: startY, dir: data?.dir || "down" };
    }
  }

  private destroyAllPlayers() {
    Object.values(this.players).forEach((p: any) => p.sprite?.destroy());
    Object.values(this.bubbles).forEach((b: any) => b?.destroy());
    this.players = {};
    this.remoteTargets = {};
    this.bubbles = {};
    this.me = null;
  }

  update() {
    if (!this.me || !this.me.body || !this.cursors) return;

    const body = this.me.body as any;
    const speed = 150;
    let vx = 0, vy = 0;
    let dir = "down";

    try {
      if (this.cursors.left.isDown) {
        vx = -speed; dir = "left";
        if (this.scene.anims.exists("left")) this.me.anims.play("left", true);
      } else if (this.cursors.right.isDown) {
        vx = speed; dir = "right";
        if (this.scene.anims.exists("right")) this.me.anims.play("right", true);
      } else if (this.cursors.up.isDown) {
        vy = -speed; dir = "up";
        if (this.scene.anims.exists("up")) this.me.anims.play("up", true);
      } else if (this.cursors.down.isDown) {
        vy = speed; dir = "down";
        if (this.scene.anims.exists("down")) this.me.anims.play("down", true);
      } else {
        this.me.anims.stop();
      }
    } catch (e) {
      console.error(e);
    }

    body.setVelocity(vx, vy);
    this.socket.emit("move", { x: this.me.x, y: this.me.y, dir });

    // Interpolate remote players + play direction anims
    Object.keys(this.remoteTargets).forEach((id) => {
      const player = this.players[id];
      const target = this.remoteTargets[id];
      if (!player?.sprite || !target) return;

      const sprite = player.sprite;
      const dx = target.x - sprite.x;
      const dy = target.y - sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      sprite.x += dx * 0.15;
      sprite.y += dy * 0.15;

      if (dist > 1.5) {
        const d = target.dir || "down";
        if (this.scene.anims.exists(d)) sprite.anims.play(d, true);
      } else {
        sprite.anims.stop();
      }
    });

    // Update depth + bubble positions
    Object.entries(this.players).forEach(([id, p]: [string, any]) => {
      const s = p.sprite;
      if (!s) return;
      s.setDepth(s.y);
      if (this.bubbles[id]) {
        const bubble = this.bubbles[id];
        const bh = bubble.getBounds ? bubble.getBounds().height : 40;
        bubble.x = s.x;
        bubble.y = s.y - bh - 58;
        bubble.setDepth(s.y + 100);
      }
    });

    // ── Push player screen positions to React for HTML name tags ──
    if (this.onPlayersUpdate) {
      const cam = this.scene.cameras.main;
      const data = Object.entries(this.players).map(([id, p]: [string, any]) => {
        const s = p.sprite;
        if (!s) return null;
        // Convert world coords → screen coords
        const cam = this.scene.cameras.main;
        // Phaser zooms around viewport center, so we must subtract the midpoint,
        // scale, then add the viewport center back
        const screenX = (s.x - cam.scrollX - cam.width / 2) * cam.zoom + cam.x + cam.width / 2;
        const screenY = (s.y - cam.scrollY - cam.height / 2) * cam.zoom + cam.y + cam.height / 2;
        return {
          id,
          name: p.data?.name || "User",
          color: p.data?.color || "#4CAF50",
          screenX,
          screenY,
          isMe: id === this.socket.id,
        };
      }).filter(Boolean);
      this.onPlayersUpdate(data);
    }

    // Proximity detection
    if (this.onNearbyPlayersChange) {
      const nearby: string[] = [];
      Object.keys(this.players).forEach((id) => {
        if (id === this.socket.id) return;
        const sprite = this.players[id]?.sprite;
        if (!sprite) return;
        const dx = this.me.x - sprite.x;
        const dy = this.me.y - sprite.y;
        if (Math.sqrt(dx * dx + dy * dy) < this.PROXIMITY_RADIUS) {
          nearby.push(id);
        }
      });
      this.onNearbyPlayersChange(nearby);
    }
  }
}