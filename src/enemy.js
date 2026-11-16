// ============================================================
// enemy.js  -  BASE CLASS for every enemy in MageQuest
// ============================================================
// Handles everything shared by all enemies:
//   * aimless wandering (random direction, random duration, random pauses)
//   * bumping into dungeon walls and picking a new direction
//   * switching between walk frames
//   * touch-damage hitbox check against the player
//
// To make a NEW enemy, don't edit this file. Copy jerry.js, rename
// the class, and change the images / speed / damage in its constructor.
// ============================================================
class Enemy {
  // frames   : array of p5 images used for the walk animation
  // x, y     : top-left position (room coordinates, same as the player)
  // settings : optional overrides, e.g. { speed: 2, damage: 20 }
  constructor(frames, x, y, settings = {}) {
    this.frames = frames;
    this.x = x;
    this.y = y;

    this.size = settings.size ?? 50;                    // drawn size in pixels
    this.speed = settings.speed ?? 1.5;                 // pixels per frame
    this.damage = settings.damage ?? 10;                // health taken from player on touch
    this.frameInterval = settings.frameInterval ?? 15;  // frames between walk-image swaps
    this.hitboxInset = settings.hitboxInset ?? 8;       // shrinks hitbox so touches feel fair

    this.frameIndex = 0;
    this.frameTick = 0;

    // movement direction: dx/dy are each -1, 0, or 1 (only one is non-zero at a time,
    // so enemies move in 4 directions like the player)
    this.dx = 0;
    this.dy = 0;
    this.turnTimer = 0;
    this.pickNewDirection();
  }

  // ---------- wandering ----------
  pickNewDirection() {
    const options = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [0, 0]                              // standing still for a moment
    ];
    const choice = options[Math.floor(Math.random() * options.length)];
    this.dx = choice[0];
    this.dy = choice[1];
    this.turnTimer = 40 + Math.floor(Math.random() * 80); // walk 40-120 frames
  }

  // walls  = dungeon.getFilledSquares() (array of Rectangle)
  // player = the Player (wanderers like Jerry ignore it, chasers like Spider use it)
  update(walls, player) {
    this.turnTimer -= 1;
    if (this.turnTimer <= 0) {
      this.pickNewDirection();
    }

    if (this.dx !== 0 || this.dy !== 0) {
      const newX = this.x + this.dx * this.speed;
      const newY = this.y + this.dy * this.speed;
      if (this.isBlocked(newX, newY, walls)) {
        this.pickNewDirection();          // hit a wall -> turn somewhere else
      } else {
        this.x = newX;
        this.y = newY;
      }

      // only animate while actually walking
      this.frameTick += 1;
      if (this.frameTick >= this.frameInterval) {
        this.frameTick = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      }
    }
  }

  // true if standing at (px, py) would hit a wall or leave the room's floor area
  isBlocked(px, py, walls) {
    // floor area of a room: columns 1-18, rows 1-10 (the outer ring is wall)
    if (px < 50 || py < 50 || px + this.size > 950 || py + this.size > 550) {
      return true;
    }
    const inset = this.hitboxInset;
    const hx = px + inset;
    const hy = py + inset;
    const hs = this.size - inset * 2;
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      if (hx < w.x + w.width && hx + hs > w.x &&
          hy < w.y + w.height && hy + hs > w.y) {
        return true;
      }
    }
    return false;
  }

  // ---------- touching the player ----------
  // Return false to make an enemy harmless for a while (e.g. a retreating spider).
  canDamage() {
    return true;
  }

  // Called by EnemyManager right after this enemy successfully damaged the player.
  // Does nothing by default; enemies override it to react to landing a hit.
  onHitPlayer(player) {}

  touchesPlayer(player) {
    const inset = this.hitboxInset;
    const ex = this.x + inset;
    const ey = this.y + inset;
    const es = this.size - inset * 2;
    const px = player.getXPos() + inset;
    const py = player.getYPos() + inset;
    const ps = 50 - inset * 2;
    return ex < px + ps && ex + es > px &&
           ey < py + ps && ey + es > py;
  }

  // ---------- drawing ----------
  draw() {
    image(this.frames[this.frameIndex], this.x, this.y, this.size, this.size);
  }
}
