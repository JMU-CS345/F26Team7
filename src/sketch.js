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
    playButton:     "assets/play_button.png",     // optional
    playButtonHover:"assets/play_button_hover.png", // optional
    introVideo:     "assets/intro.mp4",
    level1Background: "assets/level1_background.png", // optional
    playerFrame1: "assets/player_1.png", // optional; walking frame 1
    playerFrame2: "assets/player_2.png", // optional walking frame 2
    font: null, // e.g. "assets/MyFont.ttf"
    wallTile:      "assets/wall.jpeg",
    dirtyWallTile: "assets/dirtyWall.jpeg",
  },

  // Layout (positions are centers, in canvas pixels)
  layout: {
    titleY: 180,
    creditsY: 250,
    button: { x: 480, y: 565, w: 220, h: 70 },
  },

  player: {
    size: 48,          // width and height in pixels (placeholder box / sprite size)
    speed: 220,        // pixels per second
    frameTime: 0.25,   // seconds each animation frame is shown while walking
    startX: 456,       // top-left start position
    startY: 246,
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
    roomFloor: [60, 50, 90],
    door: [140, 90, 50],
  },
};

// ---------------------------------------------------------------
// Game state
// ---------------------------------------------------------------
const STATE = { MENU: "menu", VIDEO: "video", LEVEL1: "level1" };
let state = STATE.MENU;
let level1Initialized = false;
let player;
let imgs = {};          // loaded images (null if missing)
let gameFont = null;
let introVideo;
let videoFailed = false;
const cols = 32;
const rows = 18;
const tileSize = 30;
let dungeon = [];

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
  for (const key of ["menuBackground", "titleLogo", "playButton", "playButtonHover", "level1Background", "playerFrame1", "playerFrame2", "wallTile", "dirtyWallTile"]) {
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
  createCanvas(windowWidth, windowHeight);
  
  introVideo = createVideo(CONFIG.assets.introVideo);
  introVideo.hide(); // we draw it on the canvas ourselves
  introVideo.elt.addEventListener("error", () => { videoFailed = true; });
  introVideo.elt.addEventListener("ended", startLevel1);
}

function draw() {
  try {
    if (state === STATE.MENU) drawMenu();
    else if (state === STATE.VIDEO) drawVideo();
    else if (state === STATE.LEVEL1) drawLevel1();
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

  // Credits subscript
  fill(...CONFIG.colors.credits);
  noStroke();
  textSize(20);
  text(CONFIG.credits, width / 2, L.creditsY);

  drawPlayButton();
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
    rectMode(CENTER);
    noStroke();
    fill(...(hovered ? CONFIG.colors.buttonHover : CONFIG.colors.button));
    rect(b.x, b.y, b.w, b.h, 12);
    rectMode(CORNER);
    fill(...CONFIG.colors.buttonText);
    textSize(32);
    text("Play", b.x, b.y);
  }
}

// ---------------------------------------------------------------
// Intro video
// ---------------------------------------------------------------
function startVideo() {
  if (videoFailed) { startLevel1(); return; } // no video file yet? skip ahead
  state = STATE.VIDEO;
  cursor(ARROW);
  introVideo.volume(1);
  introVideo.play();
}

function drawVideo() {
  background(0);
  image(introVideo, 0, 0, width, height);

  fill(255, 140);
  noStroke();
  textAlign(RIGHT, BOTTOM);
  textSize(14);
  text("Click or press any key to skip", width - 12, height - 10);
}

// ---------------------------------------------------------------
// Level 1 (blank for now)
// ---------------------------------------------------------------
function startLevel1() {
  if (state === STATE.LEVEL1) return;
  state = STATE.LEVEL1; // switch state first so we never get stuck
  createPlayer();
  console.log("Starting level 1");
  try {
    introVideo.elt.pause();
  } catch (e) {
    console.error("Could not pause video:", e);
  }
}

function drawLevel1() {
  // One-time setup the first time level 1 is drawn
  if (!level1Initialized) {
    level1Initialized = true;
    console.log("Level 1 first frame: forcing repaint");

    clear();

    const c = drawingContext.canvas;
    const prevDisplay = c.style.display;
    c.style.display = "none";
    void c.offsetHeight;
    c.style.display = prevDisplay;
  }

  const dt = Math.min(deltaTime / 1000, 0.05);

  updatePlayer(dt);

  // --- WORLD: drawn every frame, in this order ---
  if (imgs.level1Background) image(imgs.level1Background, 0, 0, width, height);
  else background(...CONFIG.colors.level);

  drawRoom();

  // --- PLAYER: always drawn after the world so it sits on top ---
  drawPlayer();

  // Small status label (delete when real level 1 work begins)
  fill(255, 160);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text("Level 1 Under Construction - arrow keys to move", 12, 10);
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
  player = {
    x: r.innerX + r.innerW / 2 - P.size / 2,
    y: r.innerY + r.innerH / 2 - P.size / 2,
    w: P.size,
    h: P.size,
    moving: false,
    facing: 1, 
    lastAxis: "x", 
    look: "side",
    animFrame: 0,
    animTimer: 0,
  };
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

function drawPlayer() {
  // ANIMATOR: this is where your art shows up. If assets/player_1.png and
  // assets/player_2.png exist, they are drawn here automatically, one per
  // animation frame, and the box below is skipped. Draw the wizard facing
  // RIGHT; the push/translate/scale lines mirror it when he walks left.
  const sprite = player.animFrame === 0 ? imgs.playerFrame1 : imgs.playerFrame2;

  push();
  // Move the origin to the wizard's horizontal center, then mirror
  // horizontally when facing left (scale of -1 flips the x axis).
  translate(player.x + player.w / 2, player.y);
  scale(player.facing, 1);

  if (sprite) {
    // Drawn relative to the new origin, so (-w/2, 0) is the box's top-left.
    image(sprite, -player.w / 2, 0, player.w, player.h);
  } else {
    // Placeholder box: color alternates with the animation frame
    const c = player.animFrame === 0 ? CONFIG.colors.playerFrame1 : CONFIG.colors.playerFrame2;
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
  pop();
}


// ---------------------------------------------------------------
// Input
// ---------------------------------------------------------------
function mousePressed() {
  if (state === STATE.MENU && playButtonHovered()) startVideo();
  else if (state === STATE.VIDEO) startLevel1();
}

function keyPressed() {
  if (state === STATE.VIDEO) startLevel1();
  if (state === STATE.LEVEL1 && player) {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) player.lastAxis = "x";
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) player.lastAxis = "y";
  }
  if (state === STATE.LEVEL1 &&
    [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].includes(keyCode)) {
    return false;
  }

}
d