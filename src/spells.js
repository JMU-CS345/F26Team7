// ============================================================
// spells.js  -  Fire mage spells: Fireball and FireWall
// ============================================================
// All coordinates are room coordinates (same as the player/enemies).
// Walls are Rectangle objects from dungeon.getFilledSquares().

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

// ---------- Fireball: flies straight, vanishes on any hit ----------
class Fireball {
  static loadAssets() {
    Fireball.img = loadImage("assets/Fireball.png");
  }

  constructor(x, y, dx, dy) {
    this.x = x;          // center
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 8;
    this.size = 40;      // drawn size
    this.hitSize = 24;   // hitbox size
    this.damage = 10;
    this.done = false;
  }

  getHitbox() {
    return { x: this.x - this.hitSize / 2, y: this.y - this.hitSize / 2, width: this.hitSize, height: this.hitSize };
  }

  update(walls, enemies) {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    const box = this.getHitbox();

    if (box.x < 0 || box.y < 0 || box.x + box.width > 1000 || box.y + box.height > 600) {
      this.done = true;
      return;
    }
    for (const w of walls) {
      if (rectsOverlap(box, w)) {
        this.done = true;
        return;
      }
    }
    for (const e of enemies) {
      if (rectsOverlap(box, e.getHitbox())) {
        e.takeDamage(this.damage);
        this.done = true;
        return;
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(Math.atan2(this.dy, this.dx)); // image points right
    imageMode(CENTER);
    image(Fireball.img, 0, 0, this.size, this.size);
    pop();
  }
}

// ---------- FireWall: a row of fire that lasts 3 seconds ----------
class FireWall {
  static loadAssets() {
    FireWall.img = loadImage("assets/FireWall.png");
  }

  // cx, cy = center of the wall; (dx, dy) = direction the player faces.
  // The row runs sideways to that direction.
  constructor(cx, cy, dx, dy, walls) {
    this.lifetime = 180;       // frames (3 seconds at 60 fps)
    this.damage = 5;
    this.tickFrames = 30;      // each enemy can be burned twice a second
    this.tiles = [];
    const length = 3;          // tiles in the row
    const sideX = dx === 0 ? 1 : 0;
    const sideY = dx === 0 ? 0 : 1;
    for (let i = -Math.floor(length / 2); i <= Math.floor(length / 2); i++) {
      const tile = { x: cx + sideX * i * 50 - 25, y: cy + sideY * i * 50 - 25, width: 50, height: 50 };
      let blocked = tile.x < 0 || tile.y < 0 || tile.x + 50 > 1000 || tile.y + 50 > 600;
      for (const w of walls) {
        if (rectsOverlap(tile, w)) blocked = true;
      }
      if (!blocked) this.tiles.push(tile);
    }
    this.burnTimers = new Map(); // enemy -> frames until it can be burned again
  }

  get done() {
    return this.lifetime <= 0;
  }

  update(walls, enemies) {
    this.lifetime -= 1;
    for (const [enemy, t] of this.burnTimers) {
      if (t <= 1) this.burnTimers.delete(enemy);
      else this.burnTimers.set(enemy, t - 1);
    }
    for (const e of enemies) {
      if (this.burnTimers.has(e)) continue;
      const box = e.getHitbox();
      if (this.tiles.some(t => rectsOverlap(box, t))) {
        e.takeDamage(this.damage);
        this.burnTimers.set(e, this.tickFrames);
      }
    }
  }

  draw() {
    // flicker out during the last half second
    if (this.lifetime < 30 && Math.floor(this.lifetime / 4) % 2 === 0) return;
    for (const t of this.tiles) {
      image(FireWall.img, t.x, t.y, 50, 50);
    }
  }
}

// ---------- SpellManager: owns every active spell ----------
class SpellManager {
  constructor() {
    this.spells = [];
    this.fireballCooldown = 0;
    this.fireWallCooldown = 0;
    this.FIREBALL_COOLDOWN_FRAMES = 25;
    this.FIREWALL_COOLDOWN_FRAMES = 120;
  }

  clear() {
    this.spells = [];
  }

  castFireball(player) {
    if (this.fireballCooldown > 0) return;
    const [dx, dy] = player.getFacing();
    const cx = player.getXPos() + 25 + dx * 30;
    const cy = player.getYPos() + 25 + dy * 30;
    this.spells.push(new Fireball(cx, cy, dx, dy));
    this.fireballCooldown = this.FIREBALL_COOLDOWN_FRAMES;
  }

  castFireWall(player, walls) {
    if (this.fireWallCooldown > 0) return;
    const [dx, dy] = player.getFacing();
    const cx = player.getXPos() + 25 + dx * 70; // one tile in front of the player
    const cy = player.getYPos() + 25 + dy * 70;
    this.spells.push(new FireWall(cx, cy, dx, dy, dungeon.getFilledSquares()));
    this.fireWallCooldown = this.FIREWALL_COOLDOWN_FRAMES;
  }

  update(walls, enemies) {
    if (this.fireballCooldown > 0) this.fireballCooldown -= 1;
    if (this.fireWallCooldown > 0) this.fireWallCooldown -= 1;
    for (const s of this.spells) s.update(walls, enemies);
    this.spells = this.spells.filter(s => !s.done);
  }

  draw() {
    for (const s of this.spells) s.draw();
  }
}