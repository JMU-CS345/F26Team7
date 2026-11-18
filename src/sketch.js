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
let deathScreen;
let restartButton;
let mainMenuButton;
const DEATH_BUTTON_WIDTH = 220;
const DEATH_BUTTON_HEIGHT = 60;
const CHARACTER_SELECT_SCENE = 4;
var selectedCharacter = 0;
let enemyManager;
let spellManager;
const PROJECTILE_KEY = "2";   // fireball / icicle / rock
const WALL_KEY = "3";         // fire wall / ice wall / tree wall
function setup() {
  scene_num = 0; // game has not begun yet.
  start_pic = loadImage ('assets/gui/menu_background.png'); //menu image
  deathScreen = loadImage ('assets/gui/deathScreen.png'); // temporary death screen art
  restartButton = loadImage ('assets/gui/restart_button.svg');
  mainMenuButton = loadImage ('assets/gui/main_menu_button.svg');
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
  mage_walking_left_0 = loadImage ('assets/player/Mage_left1.png');
  mage_walking_left_1 = loadImage ('assets/player/Mage_left2.png');
  mage_walking_left_2 = loadImage ('assets/player/Mage_left3.png');
  //player character moving right sprites
  mage_walking_right_0 = loadImage ('assets/player/Mage_right1.png');
  mage_walking_right_1 = loadImage ('assets/player/Mage_right2.png');
  mage_walking_right_2 = loadImage ('assets/player/Mage_right3.png');
  // player character moving up
  mage_down = loadImage ('assets/player/Mage_front.png');
  // player character moving down
  mage_up = loadImage ('assets/player/Mage_back.png');
  //create player
  player = new Player(mage_walking_left_0, mage_walking_left_1, mage_walking_left_2,
    mage_walking_right_0, mage_walking_right_1, mage_walking_right_2,
    mage_down, mage_up,
    500, 300);
  createCanvas (windowWidth, windowHeight);
  not_generated = true;
  /*
  DUNGEON VARIABLES
  */
  wall = loadImage ('assets/env/wall.png');
  wall_dirty = loadImage ('assets/env/wall_dirty.PNG');
  floor = loadImage ('assets/env/floor.PNG');
  dungeon = new DungeonRoom(floor, wall, wall_dirty);
  /*
   ENEMIES
  */
  Jerry.loadAssets();  // add one line like this per new enemy type
  Spider.loadAssets();
  enemyManager = new EnemyManager();
  loadElementAssets();
  spellManager = new SpellManager();
  
}

function draw() {
  switch (scene_num) {
    case 0:
    loadMainMenu();
    break;
    case 1:
    drawVideo();
    break;
    case 2:
    level1();
    break;
    case 3:
    drawDeathScreen();
    break;
    case CHARACTER_SELECT_SCENE:
    drawCharacterSelect();
    break;
  }
}

function loadMainMenu(){
  clear();
  background(start_pic);
  // change button's color if hovered over
  if (
      mouseX >= (windowWidth/2.3) && 
      mouseX <= (windowWidth/2.3 + 200) &&
      mouseY >= (windowHeight/1.3) && 
      mouseY <= (windowHeight/1.3 + 50)
    ) {
    fill (218, 160, 200);
    if (mouseIsPressed == true) {
      fill(218, 177, 218);
      scene_num = CHARACTER_SELECT_SCENE;
    }
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
  // dress the mage in the chosen element's robe and hat
  player.setOutfit(ELEMENTS[selectedCharacter].hatImg, ELEMENTS[selectedCharacter].robeImg);
  if (videoFailed) {
    startLevel1();
    return;
  }
  scene_num = 1;
  cursor(ARROW);
  introVideo.volume(1);
  introVideo.play();
}

function characterCardBounds(index) {
  const width = 150;
  const height = 220;
  const gap = 30;
  const totalWidth = width * 3 + gap * 2;
  return {
    x: windowWidth / 2 - totalWidth / 2 + index * (width + gap),
    y: 120,
    width: width,
    height: height
  };
}

function characterCardHovered(index) {
  const card = characterCardBounds(index);
  return mouseX >= card.x && mouseX <= card.x + card.width &&
    mouseY >= card.y && mouseY <= card.y + card.height;
}

function characterSelectButtonBounds() {
  return {
    x: width / 2 - 110,
    y: height - 90,
    width: 220,
    height: 55
  };
}

function characterSelectButtonHovered() {
  const button = characterSelectButtonBounds();
  return mouseX >= button.x && mouseX <= button.x + button.width &&
    mouseY >= button.y && mouseY <= button.y + button.height;
}

function drawCharacterCard(index, name) {
  const card = characterCardBounds(index);
  const selected = selectedCharacter === index;
  const hovered = characterCardHovered(index);

  rectMode(CORNER);
  stroke(selected ? 255 : 120, selected ? 220 : 120, selected ? 90 : 160);
  strokeWeight(selected ? 5 : 2);
  fill(35, 30, 65);
  rect(card.x, card.y, card.width, card.height, 12);

  // preview: the mage wearing this element's robe and hat
  const outfit = ELEMENTS[index];
  if (mage_down) {
    image(mage_down, card.x + 45, card.y + 25, 60, 60);
  }
  image(outfit.robeImg, card.x + 45, card.y + 25, 60, 60);
  const hatSize = 60 * HAT_SCALE;
  image(outfit.hatImg, card.x + 45 + (60 - hatSize) / 2, card.y + 25 + HAT_BRIM_Y * 1.2 - hatSize, hatSize, hatSize);

  noStroke();
  fill(hovered ? 255 : 220);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(name, card.x + card.width / 2, card.y + 130);
  fill(170, 170, 200);
  textSize(14);
  text(ELEMENTS[index].spellsText, card.x + card.width / 2, card.y + 165);
}

function drawCharacterSelect() {
  background(20, 16, 40);
  cursor(characterCardHovered(0) || characterCardHovered(1) ||
    characterCardHovered(2) || characterSelectButtonHovered() ? HAND : ARROW);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  text("Choose Your Character", width / 2, 55);

  drawCharacterCard(0, "Fire");
  drawCharacterCard(1, "Ice");
  drawCharacterCard(2, "Earth");

  const button = characterSelectButtonBounds();
  rectMode(CORNER);
  noStroke();
  fill(characterSelectButtonHovered() ? 150 : 110,
    characterSelectButtonHovered() ? 110 : 70,
    characterSelectButtonHovered() ? 240 : 200);
  rect(button.x, button.y, button.width, button.height, 12);
  fill(255);
  textSize(26);
  text("Continue", button.x + button.width / 2, button.y + button.height / 2);
}

function drawVideo() {
  clear();
  background(0);
  image(introVideo, 0, 0, width, height);

  noStroke(); // to get rid of outlines for ALL shapes
}

function startLevel1() {
  if (scene_num === 2) return;
  scene_num = 2; // switch state first so we never get stuck
  try {
    introVideo.elt.pause();
  } catch (e) {
    console.error("Could not pause video:", e);
  }
}

function movePlayer(){
  if (player.isDead()) {
    player.draw();
    return;
  }

  if(keyIsDown(UP_ARROW)){
      player.moveUp(dungeon.getFilledSquares());
  }
  else if (keyIsDown(DOWN_ARROW)) {
    player.moveDown(dungeon.getFilledSquares());
  }
  else if(keyIsDown(RIGHT_ARROW)){
      player.moveRight(dungeon.getFilledSquares());
  }
  else if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft(dungeon.getFilledSquares());
    
  }
    player.update();
  const cx = player.getXPos() + 25;
  const cy = player.getYPos() + 25;
  if (dungeon.isAtExit(cx, cy)){
    dungeon.enterNextRoom();
    player.setPosition(dungeon.getEntranceCol() * 50, 500); // just above the entrance door
    enemyManager.spawnForRoom(dungeon, player);
    spellManager.clear();
  }
  else if (dungeon.isAtEntrance(cx, cy)){
    dungeon.goBack();
    player.setPosition(dungeon.getExitCol() * 50, 50); // just below that room's exit door
    enemyManager.spawnForRoom(dungeon, player);
    spellManager.clear();
  }
  player.draw();
}

function level1() {
  clear();
  background(0);
  if (not_generated){
    dungeon.generateDungeon();
    not_generated = false;
    enemyManager.spawnForRoom(dungeon, player);
    spellManager.clear();
  }
  push();
  translate(Math.floor((width - 1000) / 2), Math.floor((height - 600) / 2));
  dungeon.drawDungeon();
  if (player.isDead()) {
    scene_num = 3;
    return;
  }
  movePlayer();
  enemyManager.update(dungeon.getFilledSquares(), player);
  spellManager.update(dungeon.getFilledSquares(), enemyManager.enemies);
  enemyManager.removeDead();
  enemyManager.draw();
  spellManager.draw();
  pop();
}


// Works out where the room sits. The door is a gap in the top wall.
function getRoom() {
  const R = CONFIG.room;
  const outerX = Math.floor((width - R.w) / 2);
  const outerY = Math.floor((height - R.h) / 2);
  return {
    x: firstX + index * (DEATH_BUTTON_WIDTH + gap),
    y: height - 160,
    width: DEATH_BUTTON_WIDTH,
    height: DEATH_BUTTON_HEIGHT
  };
}

function deathButtonHovered(index) {
  const button = deathButtonBounds(index);
  return mouseX >= button.x &&
    mouseX <= button.x + button.width &&
    mouseY >= button.y &&
    mouseY <= button.y + button.height;
}

function drawDeathButton(index, label) {
  const button = deathButtonBounds(index);
  const hovered = deathButtonHovered(index);

  const buttonImage = index === 0 ? restartButton : mainMenuButton;
  if (buttonImage) {
    image(buttonImage, button.x, button.y, button.width, button.height);
    return;
  }

  rectMode(CORNER);
  noStroke();
  fill(hovered ? 150 : 110, hovered ? 110 : 70, hovered ? 240 : 200);
  rect(button.x, button.y, button.width, button.height, 12);
  stroke(255);
  strokeWeight(3);
  noFill();
  rect(button.x, button.y, button.width, button.height, 12);
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
    background(20, 16, 40);
  }

  cursor(deathButtonHovered(0) || deathButtonHovered(1) ? HAND : ARROW);
  drawDeathButton(0, "Restart");
  drawDeathButton(1, "Main Menu");
}

function restartGame() {
  player.resetHealth();
  player.x = width / 2 - 25;
  player.y = height / 2 - 25;
  player.current_image = 0;
  player.count = 7;
  not_generated = true;
  scene_num = 2;
}

function returnToMainMenu() {
  player.resetHealth();
  not_generated = true;
  selectedCharacter = 0;
  scene_num = 0;
}

function keyPressed() {
  // spells depend on the chosen element (Fire / Ice / Earth)
  if (scene_num !== 2 || player.isDead()) return;
  const element = ELEMENTS[selectedCharacter];
  if (key === PROJECTILE_KEY) {
    spellManager.castProjectile(player, element.projectile);
  } else if (key === WALL_KEY) {
    spellManager.castWall(player, element.wall, dungeon.getFilledSquares());
  }
}

function mousePressed() {
  if (scene_num === 3) {
    if (deathButtonHovered(0)) restartGame();
    else if (deathButtonHovered(1)) returnToMainMenu();
    return;
  }

  if (scene_num === CHARACTER_SELECT_SCENE) {
    for (let i = 0; i < 3; i++) {
      if (characterCardHovered(i)) {
        selectedCharacter = i;
        return;
      }
    }
    if (characterSelectButtonHovered()) startVideo();
  }
}