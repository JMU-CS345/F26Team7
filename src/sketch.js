// MageQuest - menu -> intro video -> blank level 1
// Put this file next to index.html and load it AFTER p5.js:
//   <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
//   <script src="sketch.js"></script>

// ---------------------------------------------------------------
// CONFIG: everything the artist needs to touch lives up here.
// Drop files into an "assets" folder with these names (or change
// the paths). Anything missing falls back to a plain placeholder,
// so the game runs before any art exists.
// ---------------------------------------------------------------
const CONFIG = {
  canvasW: 960,
  canvasH: 540,

  assets: {
    menuBackground: "assets/menu_background.png", // 960x540
    playButton:     "assets/start_button.svg",    // placeholder; replace with final button art later
    playButtonHover:"assets/start_button.svg",    // placeholder hover art
    introVideo:     "assets/intro.mp4",
    deathScreen: "assets/deathScreen.png", // temporary test image; replace with the death screen image later
    restartButton: "assets/restart_button.svg", // placeholder; replace with final button art later
    level1Background: "assets/level1_background.png", // optional
    playerFrame1: "assets/player_1.png", // optional; walking frame 1
    playerFrame2: "assets/player_2.png", // optional walking frame 2
    playerPlaceholderUp: "assets/player_placeholder_up.svg",
    playerPlaceholderDown: "assets/player_placeholder_down.svg",
    playerPlaceholderLeft: "assets/player_placeholder_left.svg",
    playerPlaceholderRight: "assets/player_placeholder_right.svg",
    font: null, // e.g. "assets/MyFont.ttf"
    wallTile:      "assets/wall.jpeg",
    dirtyWallTile: "assets/dirtyWall.jpeg",
  },

  // Layout (positions are centers, in canvas pixels)
  layout: {
    titleY: 180,
    creditsY: 250,
    button: { x: 480, y: 565, w: 220, h: 70 },
    restartButton: { w: 220, h: 60, bottom: 120 },
  },

  player: {
    size: 48,          // width and height in pixels (placeholder box / sprite size)
    speed: 220,        // pixels per second
    maxHealth: 100,    // maximum health for the player
    damageFlashDuration: 0.2, // seconds the player flashes red after taking damage
    frameTime: 0.25,   // seconds each animation frame is shown while walking
    startX: 456,       // top-left start position
    startY: 246,
  },

  enemy: {
    size: 42,
    speed: 90,
    maxHealth: 60,
    meleeRange: 8,
    meleeDamage: 20,
    attackCooldown: 0.8,
    startOffset: 24,
  },

  room: {
    w: 880,
    h: 480,
    border: 40,
    doorW: 80,
  },

  colors: {
    background: [20, 16, 40],
    title: [255, 255, 255],
    credits: [190, 190, 220],
    button: [110, 70, 200],
    buttonHover: [150, 110, 240],
    buttonText: [255, 255, 255],
    level: [0, 0, 0],
    playerFrame1: [120, 190, 255], // box color on animation frame 1
    playerFrame2: [255, 200, 90],  // box color on animation frame 2
    playerNose: [30, 30, 60],
    enemy: [240, 110, 30],
    healthBarBackground: [45, 20, 20],
    playerHealthBar: [70, 220, 100],
    enemyHealthBar: [230, 60, 45],
    roomFloor: [60, 50, 90],
    door: [140, 90, 50],
  },
};

// ---------------------------------------------------------------
// Game state
// ---------------------------------------------------------------
const STATE = { MENU: "menu", VIDEO: "video", LEVEL1: "level1", DEATH: "death" };
let state = STATE.MENU;
let level1Initialized = false;
let player;
let enemies = [];
let imgs = {};          // loaded images (null if missing)
let gameFont = null;
let introVideo;
let videoFailed = false;
const cols = 32;
const rows = 18;
const tileSize = 30;
let dungeon = [];
let floorNumber = 1;
let transition = createTransition();

function loadOptionalImage(key, path) {
  imgs[key] = null;
  if (!path) return;
  loadImage(path, (img) => { imgs[key] = img; }, () => { imgs[key] = null; });
}

function generateDungeon() {
  dungeon = [];

  // Fill the entire map with walls
  for (let y = 0; y < rows; y++) {
    let row = [];

    for (let x = 0; x < cols; x++) {
      row.push(1);
    }

    dungeon.push(row);
  }

  // Generate one random room
  let roomWidth = floor(random(4, 9));
  let roomHeight = floor(random(4, 8));

  let roomX = floor(random(1, cols - roomWidth - 1));
  let roomY = floor(random(1, rows - roomHeight - 1));

  // Carve out the room
  for (let y = roomY; y < roomY + roomHeight; y++) {
    for (let x = roomX; x < roomX + roomWidth; x++) {
      dungeon[y][x] = 0;
    }
  }

}

function preload() {
  for (const key of ["menuBackground", "titleLogo", "playButton", "playButtonHover", "deathScreen", "restartButton", "level1Background", "playerFrame1", "playerFrame2", "playerPlaceholderUp", "playerPlaceholderDown", "playerPlaceholderLeft", "playerPlaceholderRight", "wallTile", "dirtyWallTile"]) {
    loadOptionalImage(key, CONFIG.assets[key]);
  }
  if (CONFIG.assets.font) {
    gameFont = loadFont(CONFIG.assets.font, () => { }, () => { gameFont = null; });
  }
}

function isDirtyTile(col, row) {
  return ((col * 7 + row * 13) % 3) === 0;
}

function setup() {
  scene_num = 0; // game has not begun yet.
  start_pic = loadImage ('assets/menu_background.png'); //menu image
  /*
    INTRO VIDEO
  */
 introVideo = createVideo("assets/intro.mp4");
 introVideo.hide(); // we draw it on the canvas ourselves
 introVideo.elt.addEventListener("error", () => { videoFailed = true; });
 introVideo.elt.addEventListener("ended", startLevel1);
  
  /*
    PLAYER VARIABLES
  */
  // player character moving left sprites
  mage_walking_left_0 = loadImage ('assets/mage_left.png');
  mage_walking_left_1 = loadImage ('assets/mage_step_1.png');
  mage_walking_left_2 = loadImage ('assets/mage_step_2.png');
  //player character moving right sprites
  mage_walking_right_0 = loadImage ('assets/mage_right.png');
  mage_walking_right_1 = loadImage ('assets/mage_right_step_1.png');
  mage_walking_right_2 = loadImage ('assets/mage_right_step_2.png');
  // player character moving up
  mage_down = loadImage ('assets/mage_down.png');
  // player character moving down
  mage_up = loadImage ('assets/player_up.png');
  //create player
  player = new Player(mage_walking_left_0, mage_walking_left_1, mage_walking_left_2,
    mage_walking_right_0, mage_walking_right_1, mage_walking_right_2,
    mage_down, mage_up,
    windowWidth/2, windowHeight/2);
  createCanvas (windowWidth, windowHeight);
  not_generated = true;
  /*
  DUNGEON VARIABLES
  */
  wall = loadImage ('assets/wall.png');
  wall_dirty = loadImage ('assets/wall_dirty.PNG');
  floor = loadImage ('assets/floor.PNG');
  dungeon = new DungeonRoom(floor, wall, wall_dirty);
}

function draw() {
  try {
    if (state === STATE.MENU) drawMenu();
    else if (state === STATE.VIDEO) drawVideo();
    else if (state === STATE.LEVEL1) drawLevel1();
    else if (state === STATE.DEATH) drawDeathScreen();
  } catch (e) {
    console.error("draw() failed while in state:", state, e);
    noLoop();
  }
}

// ---------------------------------------------------------------
// Menu
// ---------------------------------------------------------------
function drawMenu() {
  if (imgs.menuBackground) image(imgs.menuBackground, 0, 0, width, height);
  else background(...CONFIG.colors.background);

  const L = CONFIG.layout;
  textAlign(CENTER, CENTER);
  if (gameFont) textFont(gameFont);

  // Title
  if (imgs.titleLogo) {
    imageMode(CENTER);
    image(imgs.titleLogo, width / 2, L.titleY);
    imageMode(CORNER);
  } else {
    fill(...CONFIG.colors.title);
    noStroke();
    textSize(84);
    text(CONFIG.title, width / 2, L.titleY);
  }
}

function playButtonHovered() {
  const b = { ...CONFIG.layout.button, x: width / 2 };
  return mouseX > b.x - b.w / 2 && mouseX < b.x + b.w / 2 &&
    mouseY > b.y - b.h / 2 && mouseY < b.y + b.h / 2;
}

function drawPlayButton() {
  const b = { ...CONFIG.layout.button, x: width / 2 };
  const hovered = playButtonHovered();
  cursor(hovered ? HAND : ARROW);

  const art = hovered && imgs.playButtonHover ? imgs.playButtonHover : imgs.playButton;
  if (art) {
    imageMode(CENTER);
    image(art, b.x, b.y, b.w, b.h);
    imageMode(CORNER);
  } else {
    fill("purple");
  }
  // create the 'play' button
  rect(windowWidth/2.3, windowHeight/1.3, 200, 52, 20);
  // create text for button
  textSize(50);
  fill ("white");
  text ("Play", (windowWidth/2.3) + 50, windowHeight/1.3 + 40);
}

function startVideo() {
  if (videoFailed) { scene_num += 1; return; } // no video file yet? skip ahead
  cursor(ARROW);
  introVideo.volume(1);
  introVideo.play();
}

function drawVideo() {
  clear();
  background(0);
  image(introVideo, 0, 0, width, height);

  noStroke(); // to get rid of outlines for ALL shapes
}

function startLevel1() {
  if (state === STATE.LEVEL1) return;
  state = STATE.LEVEL1; // switch state first so we never get stuck
  createPlayer();
  createEnemies();
  console.log("Starting level 1");
  try {
    introVideo.elt.pause();
  } catch (e) {
    console.error("Could not pause video:", e);
  }
}

function movePlayer(){
  if(keyIsDown(UP_ARROW)){
      player.moveUp(dungeon.getFilledSquares());
  }

  const dt = Math.min(deltaTime / 1000, 0.05);

  // --- UPDATE: the player is frozen while the screen is fading ---
  if (!transition.active) {
    updatePlayer(dt);
    updateEnemies(dt);
    if (player.isDead()) {
      startDeathScreen();
      return;
    }
    if (hasReachedDoor(player.y, getRoom().innerY, CONFIG.room.border)) startTransition(transition);
  }
  if (updateTransition(transition, dt, TRANSITION_TIMES)) goToNextFloor();

  // --- WORLD: drawn every frame, in this order ---
  if (imgs.level1Background) image(imgs.level1Background, 0, 0, width, height);
  else background(...CONFIG.colors.level);

  drawRoom();

  // --- PLAYER: always drawn after the world so it sits on top ---
  drawEnemies();
  drawPlayer();

  // Status label (delete when real level 1 work begins)
  fill(255, 160);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("Floor " + floorNumber + " - arrow keys to move", 12, 10);

  // --- TRANSITION: always last, so the black flash covers everything ---
  drawTransition();
}

function startDeathScreen() {
  if (state === STATE.DEATH) return;
  state = STATE.DEATH;
  console.log("Player died");
}

function drawDeathScreen() {
  if (imgs.deathScreen) {
    image(imgs.deathScreen, 0, 0, width, height);
  } else {
    background(...CONFIG.colors.background);
  }

  drawRestartButton();
}

function restartButtonBounds() {
  const b = CONFIG.layout.restartButton;
  return {
    x: width / 2,
    y: height - b.bottom - b.h / 2,
    w: b.w,
    h: b.h,
  };
}

function restartButtonHovered() {
  const b = restartButtonBounds();
  return mouseX > b.x - b.w / 2 && mouseX < b.x + b.w / 2 &&
    mouseY > b.y - b.h / 2 && mouseY < b.y + b.h / 2;
}

function drawRestartButton() {
  const b = restartButtonBounds();
  const hovered = restartButtonHovered();
  cursor(hovered ? HAND : ARROW);

  if (imgs.restartButton) {
    imageMode(CENTER);
    image(imgs.restartButton, b.x, b.y, b.w, b.h);
    imageMode(CORNER);
  } else {
    rectMode(CENTER);
    noStroke();
    fill(...(hovered ? CONFIG.colors.buttonHover : CONFIG.colors.button));
    rect(b.x, b.y, b.w, b.h, 12);
    fill(...CONFIG.colors.buttonText);
    textAlign(CENTER, CENTER);
    textSize(28);
    text("Restart", b.x, b.y);
    rectMode(CORNER);
  }
}

function restartGame() {
  floorNumber = 1;
  transition = createTransition();
  state = STATE.LEVEL1;
  createPlayer();
  createEnemies();
}

function goToNextFloor() {
  floorNumber++;
  createPlayer(); // puts the player back in the middle of the room
  createEnemies();
  // later: generate a new room layout here
}

function drawTransition() {
  const a = transitionAlpha(transition, TRANSITION_TIMES);
  if (a <= 0) return;
  noStroke();
  fill(0, a * 255);
  rect(0, 0, width, height);
}

// Works out where the room sits. The door is a gap in the top wall.
function getRoom() {
  const R = CONFIG.room;
  const outerX = Math.floor((width - R.w) / 2);
  const outerY = Math.floor((height - R.h) / 2);
  return {
    outerX: outerX,
    outerY: outerY,
    innerX: outerX + R.border,
    innerY: outerY + R.border,
    innerW: R.w - R.border * 2,
    innerH: R.h - R.border * 2,
    doorX: Math.floor(outerX + (R.w - R.doorW) / 2),
    doorW: R.doorW,
  };
}

function drawRoom() {
  const r = getRoom();
  const R = CONFIG.room;

  const t = R.border;
  noSmooth();
  for (let row = 0; row * t < R.h; row++) {
    for (let col = 0; col * t < R.w; col++) {
      const img = isDirtyTile(col, row) ? imgs.dirtyWallTile : imgs.wallTile;
      if (img) image(img, r.outerX + col * t, r.outerY + row * t, t, t);
      else { fill(0); noStroke(); rect(r.outerX + col * t, r.outerY + row * t, t, t); }
    }
  }

  // Floor
  noStroke();
  fill(...CONFIG.colors.roomFloor);
  rect(r.innerX, r.innerY, r.innerW, r.innerH);

  // Door: opens a gap through the top wall
  fill(...CONFIG.colors.door);
  rect(r.doorX, r.outerY, r.doorW, R.border);
}

function createPlayer() {
  const P = CONFIG.player;
  const r = getRoom();
  const maxHealth = Math.max(1, P.maxHealth);
  player = {
    x: r.innerX + r.innerW / 2 - P.size / 2,
    y: r.innerY + r.innerH / 2 - P.size / 2,
    w: P.size,
    h: P.size,
    maxHealth: maxHealth,
    health: maxHealth,
    damageFlashTimer: 0,
    moving: false,
    facing: 1, 
    lastAxis: "x", 
    look: "side",
    animFrame: 0,
    animTimer: 0,

    // Health is kept on the player object so a health bar can read it later
    // without coupling the player's gameplay state to its presentation.
    takeDamage(amount) {
      if (!Number.isFinite(amount) || amount < 0) {
        console.error("Player damage must be a non-negative number:", amount);
        return 0;
      }
      const previousHealth = this.health;
      this.health = Math.max(0, this.health - amount);
      const damageTaken = previousHealth - this.health;
      if (damageTaken > 0) this.damageFlashTimer = P.damageFlashDuration;
      return damageTaken;
    },

    heal(amount) {
      if (!Number.isFinite(amount) || amount < 0) {
        console.error("Player healing must be a non-negative number:", amount);
        return 0;
      }
      const previousHealth = this.health;
      this.health = Math.min(this.maxHealth, this.health + amount);
      return this.health - previousHealth;
    },

    resetHealth() {
      this.health = this.maxHealth;
    },

    getHealthRatio() {
      return this.health / this.maxHealth;
    },

    isDead() {
      return this.health <= 0;
    },
  };
}

function createEnemies() {
  const E = CONFIG.enemy;
  const r = getRoom();
  const padding = Math.max(0, E.startOffset);
  let x;
  let y;
  let attempts = 0;

  do {
    x = random(r.innerX + padding, r.innerX + r.innerW - E.size - padding);
    y = random(r.innerY + padding, r.innerY + r.innerH - E.size - padding);
    attempts++;
  } while (player && Math.hypot(
    x + E.size / 2 - (player.x + player.w / 2),
    y + E.size / 2 - (player.y + player.h / 2)
  ) < player.w * 2 && attempts < 20);

  enemies = [{
    x: x,
    y: y,
    w: E.size,
    h: E.size,
    maxHealth: Math.max(1, E.maxHealth),
    health: Math.max(1, E.maxHealth),
    attackTimer: 0,

    takeDamage(amount) {
      if (!Number.isFinite(amount) || amount < 0) {
        console.error("Enemy damage must be a non-negative number:", amount);
        return 0;
      }
      const previousHealth = this.health;
      this.health = Math.max(0, this.health - amount);
      return previousHealth - this.health;
    },

    getHealthRatio() {
      return this.health / this.maxHealth;
    },

    isDead() {
      return this.health <= 0;
    },
  }];
}

function isBlocked(x, y, w, h) {
  const r = getRoom();

  // Fully inside the floor
  if (x >= r.innerX && y >= r.innerY &&
    x + w <= r.innerX + r.innerW && y + h <= r.innerY + r.innerH) return false;

  if (x >= r.doorX && x + w <= r.doorX + r.doorW &&
    y >= r.outerY && y + h <= r.innerY + r.innerH) return false;

  return true;
}

function updatePlayer(dt) {
  player.damageFlashTimer = Math.max(0, player.damageFlashTimer - dt);

  if (player.isDead()) {
    player.moving = false;
    player.animFrame = 0;
    player.animTimer = 0;
    return;
  }

  const P = CONFIG.player;

  let dx = 0;
  let dy = 0;
  if (keyIsDown(LEFT_ARROW)) dx -= 1;
  if (keyIsDown(RIGHT_ARROW)) dx += 1;
  if (keyIsDown(UP_ARROW)) dy -= 1;
  if (keyIsDown(DOWN_ARROW)) dy += 1;

  // No diagonal movement: if a horizontal key and a vertical key are both
  // held, only the one pressed most recently counts.
  if (dx !== 0 && dy !== 0) {
    if (player.lastAxis === "x") dy = 0;
    else dx = 0;
  }

  player.moving = dx !== 0 || dy !== 0;

  // Face the way we're walking. "facing" (left/right) drives the sprite flip and
  // only changes on horizontal moves; "look" also tracks up/down for the nose.
  if (dx < 0) { player.facing = -1; player.look = "side"; }
  else if (dx > 0) { player.facing = 1; player.look = "side"; }
  else if (dy < 0) player.look = "up";
  else if (dy > 0) player.look = "down";

  if (player.moving) {
    // Only one of dx / dy is non-zero at this point
    dx = dx * P.speed * dt;
    dy = dy * P.speed * dt;

    // Move one axis at a time so the wizard can slide along walls later
    if (!isBlocked(player.x + dx, player.y, player.w, player.h)) player.x += dx;
    if (!isBlocked(player.x, player.y + dy, player.w, player.h)) player.y += dy;

    // Keep the wizard on the canvas for now
    player.x = constrain(player.x, 0, width - player.w);
    player.y = constrain(player.y, 0, height - player.h);

    // Flip between the two animation frames while walking
    player.animTimer += dt;
    if (player.animTimer >= P.frameTime) {
      player.animTimer -= P.frameTime;
      player.animFrame = 1 - player.animFrame;
    }
  } else {
    // Standing still: rest on frame 1 (animFrame 0)
    player.animFrame = 0;
    player.animTimer = 0;
  }
}

function updateEnemies(dt) {
  if (!player) return;

  const E = CONFIG.enemy;
  for (const enemy of enemies) {
    if (enemy.isDead()) continue;
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);

    const enemyCenterX = enemy.x + enemy.w / 2;
    const enemyCenterY = enemy.y + enemy.h / 2;
    const playerCenterX = player.x + player.w / 2;
    const playerCenterY = player.y + player.h / 2;
    const distanceX = playerCenterX - enemyCenterX;
    const distanceY = playerCenterY - enemyCenterY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance > E.meleeRange && distance > 0) {
      const step = Math.min(E.speed * dt, distance - E.meleeRange);
      const moveX = distanceX / distance * step;
      const moveY = distanceY / distance * step;
      if (!isBlocked(enemy.x + moveX, enemy.y, enemy.w, enemy.h)) enemy.x += moveX;
      if (!isBlocked(enemy.x, enemy.y + moveY, enemy.w, enemy.h)) enemy.y += moveY;
    }

    const touchingPlayer = enemy.x < player.x + player.w &&
      enemy.x + enemy.w > player.x &&
      enemy.y < player.y + player.h &&
      enemy.y + enemy.h > player.y;
    if (touchingPlayer && enemy.attackTimer <= 0) {
      player.takeDamage(E.meleeDamage);
      enemy.attackTimer = E.attackCooldown;
    }
  }
}

function drawHealthBar(entity, color) {
  const barWidth = entity.w;
  const barHeight = 6;
  const ratio = constrain(entity.getHealthRatio(), 0, 1);
  const x = entity.x;
  const y = entity.y - barHeight - 6;

  noStroke();
  fill(...CONFIG.colors.healthBarBackground);
  rect(x, y, barWidth, barHeight);
  fill(...color);
  rect(x, y, barWidth * ratio, barHeight);
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.isDead()) continue;
    noStroke();
    fill(...CONFIG.colors.enemy);
    rect(enemy.x, enemy.y, enemy.w, enemy.h);
    drawHealthBar(enemy, CONFIG.colors.enemyHealthBar);
  }
}

function drawPlayer() {
  // ANIMATOR: this is where your art shows up. If assets/player_1.png and
  // assets/player_2.png exist, they are drawn here automatically, one per
  // animation frame, and the box below is skipped. Draw the wizard facing
  // RIGHT; the push/translate/scale lines mirror it when he walks left.
  const directionalPlaceholder = player.look === "up"
    ? imgs.playerPlaceholderUp
    : player.look === "down"
      ? imgs.playerPlaceholderDown
      : player.facing < 0
        ? imgs.playerPlaceholderLeft
        : imgs.playerPlaceholderRight;
  const frameSprite = player.animFrame === 0 ? imgs.playerFrame1 : imgs.playerFrame2;
  const sprite = frameSprite || directionalPlaceholder;
  const usingDirectionalPlaceholder = !frameSprite && Boolean(directionalPlaceholder);

  push();
  // Move the origin to the wizard's horizontal center, then mirror
  // horizontally when facing left (scale of -1 flips the x axis).
  translate(player.x + player.w / 2, player.y);
  scale(usingDirectionalPlaceholder ? 1 : player.facing, 1);
  const damageFlashActive = player.damageFlashTimer > 0;
  if (damageFlashActive) tint(255, 0, 0);

  if (sprite) {
    // Drawn relative to the new origin, so (-w/2, 0) is the box's top-left.
    image(sprite, -player.w / 2, 0, player.w, player.h);
  } else {
    // Placeholder box: color alternates with the animation frame
    const c = damageFlashActive
      ? [255, 0, 0]
      : (player.animFrame === 0 ? CONFIG.colors.playerFrame1 : CONFIG.colors.playerFrame2);
    fill(...c);
    stroke(255);
    strokeWeight(2);
    rect(-player.w / 2, 0, player.w, player.h);

    // Small "nose" showing which way the box is looking. Left/right use the
    // right edge (the flip above moves it to the left side when facing left).
    noStroke();
    fill(...CONFIG.colors.playerNose);
    if (player.look === "up") rect(-6, 4, 12, 12);
    else if (player.look === "down") rect(-6, player.h - 16, 12, 12);
    else rect(player.w / 2 - 16, player.h / 2 - 6, 12, 12);
  }
  if (damageFlashActive) noTint();
  pop();
  drawHealthBar(player, CONFIG.colors.playerHealthBar);
}


// ---------------------------------------------------------------
// Input
// ---------------------------------------------------------------
function mousePressed() {
  if (state === STATE.MENU && playButtonHovered()) startVideo();
  else if (state === STATE.VIDEO) startLevel1();
  else if (state === STATE.DEATH && restartButtonHovered()) restartGame();
}

function keyPressed() {
  if (state === STATE.VIDEO) startLevel1();
  if (state === STATE.DEATH && (keyCode === ENTER || key === "r" || key === "R")) restartGame();
  if (state === STATE.LEVEL1 && player) {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) player.lastAxis = "x";
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) player.lastAxis = "y";
  }
  if (state === STATE.LEVEL1 &&
    [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) {
    return false;
  }

}
