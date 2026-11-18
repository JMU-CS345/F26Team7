// ============================================================
// spells.js  -  element data + spells for the Fire / Ice / Earth mages
// ============================================================
// ELEMENTS is indexed by selectedCharacter (0 = Fire, 1 = Ice, 2 = Earth).
// To tweak a spell or add an element, just edit this table.
//   projectile : the shot (key 2)     wall : the ground effect (key 3)
//   rotates    : turn the picture to face the direction it flies
// ============================================================
const ELEMENTS = [
  {
    name: "Fire",
    spellsText: "Fireball + Fire Wall",
    hat: "assets/abilities/FireMageHat.png",
    robe: "assets/abilities/FireMageRobs.png",
    projectile: { asset: "assets/abilities/Fireball.png", damage: 10, speed: 8, size: 40, rotates: true, cooldown: 25 },
    wall: { asset: "assets/abilities/FireWall.png", damage: 5, lifetime: 180, tickFrames: 30, length: 3, cooldown: 120 }
  },
  {
    name: "Ice",
    spellsText: "Icicle + Ice Wall",
    hat: "assets/abilities/IceMageHat.png",
    robe: "assets/abilities/IceMageRobe.png",
    projectile: { asset: "assets/abilities/IcicleAttack.png", damage: 8, speed: 11, size: 40, rotates: true, cooldown: 18 },
    wall: { asset: "assets/abilities/IceWall.png", damage: 4, lifetime: 180, tickFrames: 20, length: 3, cooldown: 120 }
  },
  {
    name: "Earth",
    spellsText: "Rock + Tree Wall",
    hat: "assets/abilities/EarthHat.png",
    robe: "assets/abilities/EarthMageRobe.png",
    projectile: { asset: "assets/abilities/EarthAttack.png", damage: 15, speed: 6, size: 45, rotates: false, cooldown: 40 },
    wall: { asset: "assets/abilities/EarthWall.png", damage: 7, lifetime: 180, tickFrames: 45, length: 3, cooldown: 140 }
  }
];

// Call ONCE inside setup().
function loadElementAssets() {
  for (const el of ELEMENTS) {
    el.hatImg = loadImage(el.hat);
    el.robeImg = loadImage(el.robe);
    el.projectile.img = loadImage(el.projectile.asset);
    el.wall.img = loadImage(el.wall.asset);
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

// ---------- Projectile: flies straight, vanishes on any hit ----------
class Projectile {
  constructor(x, y, dx, dy, config) {
    this.x = x;          // center
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.config = config;
    this.hitSize = 24;
    this.done = false;
  }

  getHitbox() {
    return { x: this.x - this.hitSize / 2, y: this.y - this.hitSize / 2, width: this.hitSize, height: this.hitSize };
  }

  update(walls, enemies) {
    this.x += this.dx * this.config.speed;
    this.y += this.dy * this.config.speed;
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
        e.takeDamage(this.config.damage);
        this.done = true;
        return;
      }
    }
  }

  draw() {
    const size = this.config.size;
    push();
    translate(this.x, this.y);
    if (this.config.rotates) {
      rotate(Math.atan2(this.dy, this.dx)); // pictures point right
    }
    imageMode(CENTER);
    image(this.config.img, 0, 0, size, size);
    pop();
  }
}

// ---------- SpellWall: a row of tiles that lasts a few seconds ----------
class SpellWall {
  // cx, cy = center of the wall; (dx, dy) = direction the player faces.
  // The row runs sideways to that direction.
  constructor(cx, cy, dx, dy, walls, config) {
    this.config = config;
    this.lifetime = config.lifetime;
    this.tiles = [];
    const half = Math.floor(config.length / 2);
    const sideX = dx === 0 ? 1 : 0;
    const sideY = dx === 0 ? 0 : 1;
    for (let i = -half; i <= half; i++) {
      const tile = { x: cx + sideX * i * 50 - 25, y: cy + sideY * i * 50 - 25, width: 50, height: 50 };
      let blocked = tile.x < 0 || tile.y < 0 || tile.x + 50 > 1000 || tile.y + 50 > 600;
      for (const w of walls) {
        if (rectsOverlap(tile, w)) blocked = true;
      }
      if (!blocked) this.tiles.push(tile);
    }
    this.burnTimers = new Map(); // enemy -> frames until it can be hurt again
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
        e.takeDamage(this.config.damage);
        this.burnTimers.set(e, this.config.tickFrames);
      }
    }
  }

  draw() {
    // flicker out during the last half second
    if (this.lifetime < 30 && Math.floor(this.lifetime / 4) % 2 === 0) return;
    for (const t of this.tiles) {
      image(this.config.img, t.x, t.y, 50, 50);
    }
  }
}

// ---------- SpellManager: owns every active spell ----------
class SpellManager {
  constructor() {
    this.spells = [];
    this.projectileCooldown = 0;
    this.wallCooldown = 0;
  }

  clear() {
    this.spells = [];
  }

  castProjectile(player, config) {
    if (this.projectileCooldown > 0) return;
    const [dx, dy] = player.getFacing();
    const cx = player.getXPos() + 25 + dx * 30;
    const cy = player.getYPos() + 25 + dy * 30;
    this.spells.push(new Projectile(cx, cy, dx, dy, config));
    this.projectileCooldown = config.cooldown;
  }

  castWall(player, config, walls) {
    if (this.wallCooldown > 0) return;
    const [dx, dy] = player.getFacing();
    const cx = player.getXPos() + 25 + dx * 70; // one tile in front of the player
    const cy = player.getYPos() + 25 + dy * 70;
    this.spells.push(new SpellWall(cx, cy, dx, dy, walls, config));
    this.wallCooldown = config.cooldown;
  }

  update(walls, enemies) {
    if (this.projectileCooldown > 0) this.projectileCooldown -= 1;
    if (this.wallCooldown > 0) this.wallCooldown -= 1;
    for (const s of this.spells) s.update(walls, enemies);
    this.spells = this.spells.filter(s => !s.done);
  }

  draw() {
    for (const s of this.spells) s.draw();
  }
}