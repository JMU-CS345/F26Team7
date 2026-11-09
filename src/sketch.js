var scene_num; // Start menu, level 1, etc. Start is 0.
function setup() {
  test_background_pic = loadImage ('assets/floor_test.png');
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
  not_generated = true;
  map = [];
}

function draw() {
  switch (scene_num) {
    case 0:
    loadMainMenu();
    break;
    case 1:
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

function level1() {
  
  clear();
  background(0);
  if (not_generated){
    generateDungeon();
    not_generated = false;
  }
  drawDungeon();
  movePlayer();
}

function generateDungeon() {
  alive_probability = 0.25;
  door_creation = 0.1;
  door_made = false;
  // initial generation
  for (let i = 0; i < 20; i++){
    map[i] = [];
    for (let j = 0; j < 20; j++) {
      if (Math.random() < alive_probability
      || i == 0 || j == 0 || i == 19 || j == 19){
       map[i][j] = 1;
      }
      else{
        map[i][j] = 0;
      }
    }
  }
  let side_for_door = Math.random();
  let random_num = Math.floor(Math.random() * (18 - 1 + 1)) + 1;
  if (side_for_door <= 0.25){
    map[0][random_num] = 2;
  }
  else if (side_for_door > 0.25 && side_for_door <= 0.5){
    map[19][random_num] = 2;
  }
  else if (side_for_door > 0.5 && side_for_door <= 0.75){
    map[random_num][0] = 2;
  }
  else {
    map[random_num][19] = 2;
  }
  let iterations = 10;
  let birth_threshold = 1;
  let survival_threshold = 2;
  let current_survival_points = 0;
  let current_birth_points = 0;
  while (iterations != 0)
  {
    for (let i = 1; i < 19; i++){
      for (let j = 1; j < 19; j++) {
        if (map[i][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i - 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i + 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i + 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i + 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i - 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i - 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        if (map[i][j] == 0 && current_birth_points >= birth_threshold){
          map[i][j] == 1;
        }
        if (map[i][j] == 1 && current_survival_points < survival_threshold){
          map[i][j] == 0;
        }
        current_survival_points = 0;
        current_birth_points = 0;
      }
    }
   iterations -= 1;
  }
}

function drawDungeon(){
  for (let i = 0; i < 20; i++){
    for (let j = 0; j < 20; j++) {
      if (map[i][j] == 1){
       fill("black");
       rect(i*35, j*35, 35, 35);
      }
      else if (map[i][j] == 2){
        fill("brown");
        rect(i*35, j*35, 35, 35);
      }
      else {
        fill("green");
        rect(i*35, j*35, 35, 35);
      }
    }
  }
}






