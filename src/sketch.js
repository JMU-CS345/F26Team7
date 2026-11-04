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

  title: "MageQuest",
  credits: "created by Z, Nate, Victor, and Mamadou",

  assets: {
    menuBackground: "assets/menu_background.png", // 960x540
    titleLogo:      "assets/title_logo.png",      // optional; replaces the text title
    playButton:     "assets/play_button.png",     // optional
    playButtonHover:"assets/play_button_hover.png", // optional
    introVideo:     "assets/intro.mp4",
    level1Background: "assets/level1_background.png", // optional
    font:           null, // e.g. "assets/MyFont.ttf"
  },

  // Layout (positions are centers, in canvas pixels)
  layout: {
    titleY: 180,
    creditsY: 250,
    button: { x: 480, y: 360, w: 220, h: 70 },
  },

  colors: {
    background: [20, 16, 40],
    title: [255, 255, 255],
    credits: [190, 190, 220],
    button: [110, 70, 200],
    buttonHover: [150, 110, 240],
    buttonText: [255, 255, 255],
    level: [0, 0, 0],
  },
};

// ---------------------------------------------------------------
// Game state
// ---------------------------------------------------------------
const STATE = { MENU: "menu", VIDEO: "video", LEVEL1: "level1" };
let state = STATE.MENU;
let level1Initialized = false;
let imgs = {};          // loaded images (null if missing)
let gameFont = null;
let introVideo;
let videoFailed = false;

function loadOptionalImage(key, path) {
  imgs[key] = null;
  if (!path) return;
  loadImage(path, (img) => { imgs[key] = img; }, () => { imgs[key] = null; });
}

function preload() {
  for (const key of ["menuBackground", "titleLogo", "playButton", "playButtonHover", "level1Background"]) {
    loadOptionalImage(key, CONFIG.assets[key]);
  }
  if (CONFIG.assets.font) {
    gameFont = loadFont(CONFIG.assets.font, () => {}, () => { gameFont = null; });
  }
}

function setup() {
  createCanvas(CONFIG.canvasW, CONFIG.canvasH);

  introVideo = createVideo(CONFIG.assets.introVideo);
  introVideo.hide(); // we draw it on the canvas ourselves
  introVideo.elt.addEventListener("error", () => { videoFailed = true; });
  introVideo.elt.addEventListener("ended", startLevel1);
  generateDungeon();
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
  const b = CONFIG.layout.button;
  return mouseX > b.x - b.w / 2 && mouseX < b.x + b.w / 2 &&
         mouseY > b.y - b.h / 2 && mouseY < b.y + b.h / 2;
}

function drawPlayButton() {
  const b = CONFIG.layout.button;
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
  state = STATE.LEVEL1;          // switch state first so we never get stuck
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

  if (imgs.level1Background) image(imgs.level1Background, 0, 0, width, height);
  else background(...CONFIG.colors.level);

  // Placeholder text
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(40);
  if (gameFont) textFont(gameFont);
  text("Level 1 Under Construction", width / 2, height / 2);

  // Level 1 gameplay goes here.
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
}

function generateDungeon() {
  let cols = 30;
  let rows = 10;
  let dungeon = [];
  for (let y = 0; y < rows; y++) {
    let row = [];

    for (let x = 0; x < cols; x++) {
      row.push(1);
    }

    dungeon.push(row);
  }
}