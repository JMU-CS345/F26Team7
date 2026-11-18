class DungeonRoom {
    constructor(floor, wall, wall_dirty){
        this.map = [];
        this.all_filled_squares = [];
        this.floor = floor;
        this.wall = wall;
        this.wall_dirty = wall_dirty;
        this.exit_col = -1;
        this.entrance_col = null;
        this.history = [];
    }



generateDungeon(entrance_col = null) {
  this.map = [];
  this.entrance_col = entrance_col;
  let alive_probability = 0.15;
  let dirty_probability = 0.6;
  // initial generation
  for (let i = 0; i < 12; i++){
    this.map[i] = [];
    for (let j = 0; j < 20; j++) {
      if (Math.random() < alive_probability
      || i == 0 || j == 0 || i == 11 || j == 19){
        if (Math.random() < dirty_probability){
           this.map[i][j] = 2; 
        }
        else {
            this.map[i][j] = 1;
        }
        
      }
      else{  
        this.map[i][j] = 0;
      }
    }
  }
  // pick a new exit column on the top wall (never a corner, never the same as last time)
  let new_exit = this.exit_col;
  while (new_exit == this.exit_col){
    new_exit = 1 + Math.floor(Math.random() * 18);
  }
  this.exit_col = new_exit;
  this.map[0][this.exit_col] = 3;
  // entrance door on the bottom wall, if we came from another room
  if (this.entrance_col !== null){
    this.map[11][this.entrance_col] = 4;
  }
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
        if (this.map[i][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i - 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i + 1][j] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i + 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i + 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i - 1][j + 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i - 1][j - 1] == 1) {
          current_survival_points += 1;
          current_birth_points += 1;
        }
        else if (this.map[i][j] == 0 && current_birth_points >= birth_threshold){
          this.map[i][j] == 1;
        }
        else if (this.map[i][j] == 1 && current_survival_points < survival_threshold){
          this.map[i][j] == 0;
        }
        // check if near door
        if (this.map[i][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i - 1][j] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i + 1][j] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i + 1][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i + 1][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i - 1][j + 1] == 2) {
          current_survival_points = -8;
          current_birth_points = -8;
        }
        else if (this.map[i - 1][j - 1] == 2) {
          current_survival_points = -8;
          current_birth_points += -8;
        }
        if (this.map[i][j] == 0 && current_birth_points >= birth_threshold){
          this.map[i][j] == 1;
        }
        if (this.map[i][j] == 1 && current_survival_points < survival_threshold){
          this.map[i][j] == 0;
        }
        current_survival_points = 0;
        current_birth_points = 0;
      }
    }
   iterations -= 1;
  }

  this.map[1][this.exit_col] = 0;
  if (this.entrance_col !== null){
    this.map[10][this.entrance_col] = 0;
  }
  this.map[6][10] = 0;
}

drawDungeon(){
  this.all_filled_squares = [];
  let black_square_count = 0;
  for (let i = 0; i < 12; i++){
    for (let j = 0; j < 20; j++) {
      if (this.map[i][j] == 1){
       this.all_filled_squares[black_square_count] = new Rectangle (j * 50, i * 50, 50, 50);
       black_square_count += 1;
       image(this.wall, j*50, i*50, 50,50);
      }
      else if (this.map[i][j] == 2) {
        this.all_filled_squares[black_square_count] = new Rectangle (j * 50, i * 50, 50, 50);
        black_square_count += 1;
        image(this.wall_dirty, j*50, i*50, 50,50);
      }
      else {
        fill("green");
        image(this.floor, j*50, i*50, 50,50);
      }
    }
  }
  fill("brown");
  rect(this.exit_col * 50, 0, 50, 50);
  if (this.entrance_col !== null){
    fill("darkblue");
    rect(this.entrance_col * 50, 11 * 50, 50, 50);
  }
}

getFilledSquares(){
    return this.all_filled_squares;
}
getExitCol(){
  return this.exit_col;
}

getEntranceCol(){
  return this.entrance_col;
}

isAtExit(x, y){
  return x >= this.exit_col * 50 && x < (this.exit_col + 1) * 50 && y < 50;
}

isAtEntrance(x, y){
  return this.entrance_col !== null &&
    x >= this.entrance_col * 50 && x < (this.entrance_col + 1) * 50 && y >= 550;
}

enterNextRoom(){
  // save this room, then build a new one whose entrance lines up with the door we just used
  this.history.push({map: this.map, exit_col: this.exit_col, entrance_col: this.entrance_col});
  this.generateDungeon(this.exit_col);
}

goBack(){
  const previous = this.history.pop();
  this.map = previous.map;
  this.exit_col = previous.exit_col;
  this.entrance_col = previous.entrance_col;
}
}