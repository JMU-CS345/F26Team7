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
    playerFrame1:   "assets/player_1.png", // optional; walking frame 1
    playerFrame2:   "assets/player_2.png", // optional walking frame 2
    font:           null, // e.g. "assets/MyFont.ttf"
  },

  // Layout (positions are centers, in canvas pixels)
  layout: {
    titleY: 180,
    creditsY: 250,
    button: { x: 480, y: 360, w: 220, h: 70 },
  },
  
  player: {
    size: 48,          // width and height in pixels (placeholder box / sprite size)
    speed: 220,        // pixels per second
    frameTime: 0.25,   // seconds each animation frame is shown while walking
    startX: 456,       // top-left start position
    startY: 246,
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
    playerNose:   [30, 30, 60],
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

function loadOptionalImage(key, path) {
  imgs[key] = null;
  if (!path) return;
  loadImage(path, (img) => { imgs[key] = img; }, () => { imgs[key] = null; });
}

function preload() {
  for (const key of ["menuBackground", "titleLogo", "playButton", "playButtonHover", "level1Background", "playerFrame1", "playerFrame2"]) {
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
  background(220);
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
