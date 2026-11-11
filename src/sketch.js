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
  not_generated = true;
  map = [];
  map_of_squares = [];
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
      player.moveUp(map_of_squares);
  }
  else if (keyIsDown(DOWN_ARROW)) {
    player.moveDown(map_of_squares);
  }
  else if(keyIsDown(RIGHT_ARROW)){
      player.moveRight(map_of_squares);
  }
  else if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft(map_of_squares);
    
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

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
}

function generateDungeon() {
  alive_probability = 0.15;
  // initial generation
  for (let i = 0; i < 12; i++){
    map[i] = [];
    for (let j = 0; j < 20; j++) {
      if (Math.random() < alive_probability
      || i == 0 || j == 0 || i == 11 || j == 19){
        map[i][j] = 1;
      }
      else{
        map[i][j] = 0;
      }
    }
  }
  //create door
  map[0][11] = 2;
  //run birth/survival sim
  let iterations = 90;
  let birth_threshold = 1;
  let survival_threshold = 2;
  let current_survival_points = 0;
  let current_birth_points = 0;
  while (iterations != 0)
  {
    for (let i = 1; i < 11; i++){
      for (let j = 1; j < 19; j++) {
        if (map[i][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i - 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i + 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i + 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i + 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i - 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i - 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (map[i][j] == 0 && current_birth_points >= birth_threshold){
          map[i][j] == 1;
        }
        else if (map[i][j] == 1 && current_survival_points < survival_threshold){
          map[i][j] == 0;
        }
        // check if near door
        if (map[i][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i - 1][j] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i + 1][j] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i + 1][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i + 1][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i - 1][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (map[i - 1][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points += -8;
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
  let black_square_count = 0;
  for (let i = 0; i < 12; i++){
    for (let j = 0; j < 20; j++) {
      if (map[i][j] == 1){
       fill("black");
       rect(j*50, i*50, 50, 50);
       map_of_squares[black_square_count] = new Rectangle (j * 50, i * 50, 50, 50);
       black_square_count += 1;
      }
      else {
        fill("green");
        rect(j*50, i*50, 50, 50);
      }
    }
  }
  fill("brown");
  rect(11*50, 0, 50, 50);
}






