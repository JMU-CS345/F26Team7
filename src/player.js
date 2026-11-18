// Hat placement (in pixels, for the 50x50 mage tile). Tweak these if the hat looks off.
const HAT_SCALE = 0.75;    // 1 = same size as the mage tile, smaller = smaller hat
const HAT_BRIM_Y = 16;     // y position of the hat's brim inside the tile (0 = top edge, 50 = bottom edge)

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
            if (Math.abs(this.y - (map_of_squares[i].getY() + 50)) < 5 &&
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
            if (Math.abs((this.y + 50) - (map_of_squares[i].getY())) < 5 &&
             this.x + 25 >= map_of_squares[i].getX()  &&
             this.x + 25 <= map_of_squares[i].getX() + 50
            ){
                return;
            }
        }

        if (this.y >= 600 - 50){
            return;
        }
        this.current_image = 6;
        this.count -= 1;
        this.y += this.speed;
    }
    moveLeft(map_of_squares) {
        for (let i = 0; i < map_of_squares.length; i++){
            if (Math.abs((this.x) - (map_of_squares[i].getX() + 50)) < 5 &&
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
            if (Math.abs((this.x + 50) - (map_of_squares[i].getX())) < 5 &&
             ((this.y + 50 >= map_of_squares[i].getY()  &&
             this.y + 50  <= map_of_squares[i].getY() + 50) ||
             (this.y + 25 >= map_of_squares[i].getY()  &&
             this.y + 25 <= map_of_squares[i].getY() + 50))
            ){
                return;
            }
        }
        if (this.x >= 1000 - 50){
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

    // robe and hat images worn on top of the mage sprite (set when the game starts)
    setOutfit(hatImage, robeImage) {
        this.hat = hatImage;
        this.robe = robeImage;
    }

    drawOutfitPiece(img, flip) {
        if (!img) return;
        if (flip) {
            push();
            translate(this.x + 50, this.y);
            scale(-1, 1);
            image(img, 0, 0, 50, 50);
            pop();
        } else {
            image(img, this.x, this.y, 50, 50);
        }
    }

    // draws the hat sitting on top of the head; the tip trails behind, so mirror it when facing right
    drawHat() {
        if (!this.hat) return;
        const size = 50 * HAT_SCALE;
        const left = this.x + (50 - size) / 2;
        const top = this.y + HAT_BRIM_Y - size;
        const facingRight = this.current_image >= 3 && this.current_image <= 5;
        if (facingRight) {
            push();
            translate(left + size, top);
            scale(-1, 1);
            image(this.hat, 0, 0, size, size);
            pop();
        } else {
            image(this.hat, left, top, size, size);
        }
    }

    draw() {
    image(this.frames[this.current_image], this.x, this.y, 50,50);
    this.drawOutfitPiece(this.robe, false);
    this.drawHat();

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
    
    // returns [dx, dy] for the direction the mage is currently facing
    getFacing(){
        if (this.current_image <= 2) return [-1, 0];
        if (this.current_image <= 5) return [1, 0];
        if (this.current_image == 6) return [0, 1];
        return [0, -1];
    }
    getXPos(){
        return this.x;
    }
    setPosition(x, y){
        this.x = x;
        this.y = y;
    }
    getYPos(){
        return this.y;
    }

}