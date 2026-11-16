// ============================================================
// enemy_manager.js  -  keeps track of every enemy in the current room
// ============================================================
// sketch.js only talks to this class, so it never needs to know
// which enemies exist.
//
// ADDING A NEW ENEMY TYPE: add one line to SPAWN_TABLE below.
//   { type: Jerry, count: 2 }  ->  2 Jerrys in every new room
// ============================================================
const SPAWN_TABLE = [
  { type: Jerry, count: 2 },
  { type: Spider, count: 1 },
  // { type: Bob, count: 1 },    // <- example of a future enemy
];

class EnemyManager {
  constructor() {
    this.enemies = [];
    this.hitCooldown = 0;          // frames of invulnerability left after a hit
    this.hitCooldownFrames = 45;   // ~0.75 sec at 60 fps, so one touch isn't 60 hits/sec
    this.minSpawnDistance = 200;   // never spawn right on top of the player
  }

  clear() {
    this.enemies = [];
  }

  // Call whenever a new room is generated or entered.
  spawnForRoom(dungeon, player) {
    this.clear();
    this.hitCooldown = 0;

    // collect every empty floor tile that is far enough from the player
    const px = player.getXPos() + 25;
    const py = player.getYPos() + 25;
    const spots = [];
    for (let i = 1; i < 11; i++) {
      for (let j = 1; j < 19; j++) {
        if (dungeon.map[i][j] === 0) {
          const x = j * 50;
          const y = i * 50;
          if (Math.hypot(x + 25 - px, y + 25 - py) > this.minSpawnDistance) {
            spots.push({ x: x, y: y });
          }
        }
      }
    }

    // shuffle the spots, then hand them out
    for (let i = spots.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [spots[i], spots[r]] = [spots[r], spots[i]];
    }
    for (const entry of SPAWN_TABLE) {
      for (let n = 0; n < entry.count && spots.length > 0; n++) {
        const spot = spots.pop();
        this.enemies.push(new entry.type(spot.x, spot.y));
      }
    }
  }

  // Call every frame while playing.
  update(walls, player) {
    if (this.hitCooldown > 0) {
      this.hitCooldown -= 1;
    }
    for (const enemy of this.enemies) {
      enemy.update(walls, player);
      if (this.hitCooldown === 0 && enemy.canDamage() && enemy.touchesPlayer(player)) {
        player.takeDamage(enemy.damage);
        enemy.onHitPlayer(player);
        this.hitCooldown = this.hitCooldownFrames;
      }
    }
  }

  draw() {
    for (const enemy of this.enemies) {
      enemy.draw();
    }
  }
}
