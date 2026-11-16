// ============================================================
// spider.js  -  the "Spider" enemy
// ============================================================
// Super aggressive: chases the player and lunges when close.
// After it lands a hit it runs away, rests for a moment, then comes back.
//
// States:  'chase'   -> hunting the player (can deal damage)
//          'retreat' -> running away after a hit (harmless)
//          'rest'    -> waiting before the next attack (harmless)
// ============================================================
class Spider extends Enemy {
  // Call ONCE inside setup().
  static loadAssets() {
    Spider.frames = [
      loadImage('assets/SpiderFrame1.png'),
      loadImage('assets/SpiderFrame2.png')
    ];
    Spider.attackFrame = loadImage('assets/SpiderAttackFrame.png');
  }

  constructor(x, y) {
    super(Spider.frames, x, y, {
      speed: 2.6,          // chase speed (player is 4)
      damage: 15,
      frameInterval: 8     // legs move fast
    });

    // ---- tuning ----
    this.lungeRange = 90;      // distance (px) at which it lunges and shows the attack image
    this.lungeSpeed = 4.2;     // speed while lunging
    this.retreatSpeed = 3.5;   // speed while running away
    this.retreatFrames = 70;   // how long it runs away
    this.restFrames = 90;      // how long it waits before coming back (60 frames = 1 sec)
    this.attackFlashFrames = 15; // attack image stays visible this long after a hit

    this.state = 'chase';
    this.stateTimer = 0;
    this.attackFlash = 0;
    this.isAttacking = false;
  }

  // only dangerous while hunting
  canDamage() {
    return this.state === 'chase';
  }

  // EnemyManager calls this right after the spider damages the player
  onHitPlayer(player) {
    this.state = 'retreat';
    this.stateTimer = this.retreatFrames;
    this.attackFlash = this.attackFlashFrames;
  }

  update(walls, player) {
    const dx = player.getXPos() - this.x;
    const dy = player.getYPos() - this.y;
    const dist = Math.hypot(dx, dy);
    let moving = false;

    if (this.attackFlash > 0) {
      this.attackFlash -= 1;
    }

    if (this.state === 'chase') {
      const lunging = dist < this.lungeRange;
      this.stepToward(dx, dy, dist, lunging ? this.lungeSpeed : this.speed, walls);
      this.isAttacking = lunging;
      moving = true;
    }
    else if (this.state === 'retreat') {
      this.stepToward(-dx, -dy, dist, this.retreatSpeed, walls); // opposite direction
      this.isAttacking = this.attackFlash > 0;
      moving = true;
      this.stateTimer -= 1;
      if (this.stateTimer <= 0) {
        this.state = 'rest';
        this.stateTimer = this.restFrames;
      }
    }
    else { // 'rest'
      this.isAttacking = false;
      this.stateTimer -= 1;
      if (this.stateTimer <= 0) {
        this.state = 'chase';
      }
    }

    if (moving) {
      this.frameTick += 1;
      if (this.frameTick >= this.frameInterval) {
        this.frameTick = 0;
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      }
    }
  }

  // Move toward (dx, dy). X and Y are tried separately so the spider
  // slides along walls instead of freezing when one direction is blocked.
  stepToward(dx, dy, dist, speed, walls) {
    if (dist === 0) return;
    const moveX = (dx / dist) * speed;
    const moveY = (dy / dist) * speed;
    if (!this.isBlocked(this.x + moveX, this.y, walls)) {
      this.x += moveX;
    }
    if (!this.isBlocked(this.x, this.y + moveY, walls)) {
      this.y += moveY;
    }
  }

  draw() {
    const img = this.isAttacking ? Spider.attackFrame : this.frames[this.frameIndex];
    image(img, this.x, this.y, this.size, this.size);
  }
}
