var scene_num; // Start menu, level 1, etc. Start is 0.
let videoFailed = false;
let deathScreen;
let restartButton;
let mainMenuButton;
const DEATH_BUTTON_WIDTH = 220;
const DEATH_BUTTON_HEIGHT = 60;
const CHARACTER_SELECT_SCENE = 4;
let selectedCharacter = 0;

function setup() {
  scene_num = 0; // game has not begun yet.
  start_pic = loadImage ('assets/menu_background.png'); //menu image
  deathScreen = loadImage ('assets/deathScreen.png'); // temporary death screen art
  restartButton = loadImage ('assets/restart_button.svg');
  mainMenuButton = loadImage ('assets/main_menu_button.svg');
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

  if (index === 0 && mage_down) {
    image(mage_down, card.x + 45, card.y + 25, 60, 60);
  } else {
    noStroke();
    fill(index === 1 ? 80 : 180, index === 1 ? 150 : 80, 220);
    rect(card.x + 45, card.y + 25, 60, 60, 10);
  }

  noStroke();
  fill(hovered ? 255 : 220);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(name, card.x + card.width / 2, card.y + 130);
  fill(170, 170, 200);
  textSize(14);
  text(index === 0 ? "Available" : "Placeholder", card.x + card.width / 2, card.y + 165);
}

function drawCharacterSelect() {
  background(20, 16, 40);
  cursor(characterCardHovered(0) || characterCardHovered(1) ||
    characterCardHovered(2) || characterSelectButtonHovered() ? HAND : ARROW);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  text("Choose Your Character", width / 2, 55);

  drawCharacterCard(0, "Mage");
  drawCharacterCard(1, "Knight");
  drawCharacterCard(2, "Rogue");

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
  player.draw();
}

function level1() {
  clear();
  background(0);
  if (not_generated){
    dungeon.generateDungeon();
    not_generated = false;
  }
  dungeon.drawDungeon();
  if (player.isDead()) {
    scene_num = 3;
    return;
  }
  movePlayer();
}

function deathButtonBounds(index) {
  const gap = 20;
  const totalWidth = DEATH_BUTTON_WIDTH * 2 + gap;
  const firstX = width / 2 - totalWidth / 2;
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
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text(label, button.x + button.width / 2, button.y + button.height / 2);
}

function drawDeathScreen() {
  if (deathScreen) {
    image(deathScreen, 0, 0, width, height);
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