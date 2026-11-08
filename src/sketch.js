
var scene_num; // Start menu, level 1, etc. Start is 0.
function setup() {
  start_pic = loadImage ('assets/menu_background.png');
  mage_walking_0 = loadImage ('assets/player_left.png');
  mage_walking_1 = loadImage ('assets/player_right.png');
  player = new Player(mage_walking_0, mage_walking_1, windowWidth/2, windowHeight/2);
  scene_num = 0; // game has not begun yet.
  createCanvas (windowWidth, windowHeight);
}

function draw() {
  switch (scene_num) {
    case 0:
    loadMainMenu();
    break;
    case 1:
    loadMovementTest();
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

function loadMovementTest(){
  clear();
  background(220);
  player.update();
  player.draw();
}


