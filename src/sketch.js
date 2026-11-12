var scene_num; // Start menu, level 1, etc. Start is 0.
let videoFailed = false;
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
      scene_num = 1;
      startVideo();
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
  if (scene_num === 2) return;
  scene_num = 2; // switch state first so we never get stuck
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
  movePlayer();
}