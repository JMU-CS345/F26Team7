class DungeonRoom {
    constructor(floor, wall, wall_dirty){
        this.map = [];
        this.all_filled_squares = [];
        this.floor = floor;
        this.wall = wall;
        this.wall_dirty = wall_dirty;
        
    }



generateDungeon() {
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
  //create door the value 3 isn't important yet
  this.map[0][11] = 3;
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
}

drawDungeon(){
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
  rect(11*50, 0, 50, 50);
}

getFilledSquares(){
    return this.all_filled_squares;
}

}