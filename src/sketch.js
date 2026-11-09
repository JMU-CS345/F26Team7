var scene_num; // Start menu, level 1, etc. Start is 0.
function setup() {
  start_pic = loadImage ('assets/menu_background.png');
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
  scene_num = 0; // game has not begun yet.
  createCanvas (windowWidth, windowHeight);
}

function draw() {
  switch (scene_num) {
    case 0:
    loadMainMenu();
    break;
    case 1:
    movePlayer();
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

function movePlayer(){
  clear();
  background(220);
  if(keyIsDown(UP_ARROW)){
      player.moveUp();
  }
  else if (keyIsDown(DOWN_ARROW)) {
      player.moveDown();
  }
  else if(keyIsDown(RIGHT_ARROW)){
      player.moveRight();
  }
  else if (keyIsDown(LEFT_ARROW)) {
      player.moveLeft();
  }
  player.update();
  player.draw();
  
}





