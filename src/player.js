class Player {
    constructor(image0_left, image1_left, image2_left, 
        image0_right, image1_right, image2_right, 
        mage_down, mage_up,
        x, y, v){
        this.speed = 4;
        this.frames = [image0_left, image1_left, image2_left, 
        image0_right, image1_right, image2_right, mage_down, mage_up];
        this.current_image = 0;
        this.x = x;
        this.y = y;
        this.count = 7;
        this.movement = createVector(0,0);
        this.maxHealth = 100;
        this.health = this.maxHealth;
  
    }
    
    moveUp(map_of_squares) {
        for (let i = 0; i < map_of_squares.length; i++){
            if (Math.abs(this.y - (map_of_squares[i].getY() + 50)) < 3 &&
             this.x + 25 >= map_of_squares[i].getX()  &&
             this.x + 25 <= map_of_squares[i].getX() + 50
            ){
                return;
            }
        }
        if (this.y <= 0){
            return;
        }
        this.current_image = 7;
        this.count -= 1;
        this.y -= this.speed;
    }
    moveDown(map_of_squares) {
        for (let i = 0; i < map_of_squares.length; i++){
            if (Math.abs((this.y + 50) - (map_of_squares[i].getY())) < 3 &&
             this.x + 25 >= map_of_squares[i].getX()  &&
             this.x + 25 <= map_of_squares[i].getX() + 50
            ){
                return;
            }
        }

        if (this.y > windowHeight - 100){
            return;
        }
        this.current_image = 6;
        this.count -= 1;
        this.y += this.speed;
    }
    moveLeft(map_of_squares) {
        for (let i = 0; i < map_of_squares.length; i++){
            if (Math.abs((this.x) - (map_of_squares[i].getX() + 50)) < 3 &&
             ((this.y + 50 >= map_of_squares[i].getY()  &&
             this.y + 50  <= map_of_squares[i].getY() + 50) ||
             (this.y + 25 >= map_of_squares[i].getY()  &&
             this.y + 25 <= map_of_squares[i].getY() + 50))
            ){
                return;
            }
        }
        if (this.x <= 0){
            return;
        }
        this.count -= 1;
        //immediately flips the mage if it was facing right
        if (this.current_image > 2){
            this.current_image = 0;
        }
        if (this.count == 0) {
            if (this.current_image >= 2 
            ){
                this.current_image = 0;
            } else {
                this.current_image += 1;
            }
        }
        this.x -= this.speed;
    }
    moveRight(map_of_squares) {
        for (let i = 0; i < map_of_squares.length; i++){
            if (Math.abs((this.x + 50) - (map_of_squares[i].getX())) < 4 &&
             ((this.y + 50 >= map_of_squares[i].getY()  &&
             this.y + 50  <= map_of_squares[i].getY() + 50) ||
             (this.y + 25 >= map_of_squares[i].getY()  &&
             this.y + 25 <= map_of_squares[i].getY() + 50))
            ){
                return;
            }
        }
        if (this.x >= windowWidth - 100){
            return;
        }
        this.count -= 1;
         //immediately flips the mage if it was facing left
        if (this.current_image <= 2){
            this.current_image = 3;
        }
        if (this.count == 0) {
            if (this.current_image < 3 ||
                this.current_image >= 5){

                this.current_image = 3;
            } else {
                this.current_image += 1;
            }
        }
        this.x += this.speed;
    }
    update() {
        if (this.count == 0) {
            this.count = 7;
        }
    }

    takeDamage(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            console.error("Player damage must be a non-negative number:", amount);
            return 0;
        }
        const previousHealth = this.health;
        this.health = Math.max(0, this.health - amount);
        return previousHealth - this.health;
    }

    heal(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            console.error("Player healing must be a non-negative number:", amount);
            return 0;
        }
        const previousHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health - previousHealth;
    }

    isDead() {
        return this.health <= 0;
    }

    resetHealth() {
        this.health = this.maxHealth;
    }

    getHealthRatio() {
        return this.health / this.maxHealth;
    }

    draw() {
    image(this.frames[this.current_image], this.x, this.y, 50,50);

    // Keep the health bar inside the player square, just below its top edge.
    const barX = this.x + 5;
    const barY = this.y + 5;
    const barWidth = 40;
    const barHeight = 5;
    const healthRatio = constrain(this.getHealthRatio(), 0, 1);

    noStroke();
    fill(45, 20, 20);
    rect(barX, barY, barWidth, barHeight);
    fill(70, 220, 100);
    rect(barX, barY, barWidth * healthRatio, barHeight);
    }
    
    getXPos(){
        return this.x;
    }
    getYPos(){
        return this.y;
    }

}
