class Player {
    constructor(image0, image1, x, y){
        this.speed = 4;
        this.frames = [image0, image1];
        this.current_image = 0;
        this.x = x;
        this.y = y;
        this.count = 10;
    }
    update() {
        let movement = createVector(0,0);
        
        if(keyIsPressed){
            switch (key) {
                case 'ArrowUp':
                    movement.y -= 1;
                    console.log(this.count);
                break;
                case 'ArrowDown':
                    movement.y += 1;
                break;
                case 'ArrowLeft':
                    this.count -= 1;
                    if (this.count == 0){
                        this.count = 25;
                        this.current_image += 1;
                    }
                    movement.x -= 1;
                break;
                case 'ArrowRight':
                    this.count -= 1;
                    if (this.count == 0){
                        this.count = 25;
                        this.current_image += 1;
                    }
                    movement.x += 1;
                break;
            }
        }
        if (this.current_image > 1){
                this.current_image = 0;
        }
        movement.setMag(this.speed); // sets move speed
        this.x += movement.x; // updates position x
        this.y += movement.y; // updates position y
    }

    draw() {
    image(this.frames[this.current_image], this.x, this.y, 100,100);
      
      
    }

}