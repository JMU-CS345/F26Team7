// ============================================================
// jerry.js  -  the "Jerry" enemy
// ============================================================
// Walks around aimlessly and hurts the player if touched.
//
// COPY THIS FILE to make a new enemy (e.g. bob.js):
//   1. rename the class and the image paths
//   2. tweak speed / damage in the constructor
//   3. call YourEnemy.loadAssets() in setup()           (sketch.js)
//   4. add it to the spawn table in enemy_manager.js
//   5. add its <script> tag to index.html
// ============================================================
class Jerry extends Enemy {
  // Call ONCE inside setup() so the images are loaded before the game starts.
  static loadAssets() {
    Jerry.frames = [
      loadImage('assets/Jerry1.png'),
      loadImage('assets/Jerry2.png')
    ];
  }

  constructor(x, y) {
    super(Jerry.frames, x, y, {
      speed: 1.5,          // slower than the player (4)
      damage: 10,          // player has 100 health
      frameInterval: 15    // lower = flaps its legs faster
    });
  }
}
