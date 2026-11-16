describe("Player health", function () {
  function makePlayer() {
    return new Player(
      "left0", "left1", "left2",
      "right0", "right1", "right2",
      "down", "up",
      100, 120
    );
  }

  it("starts at full health and draws a proportional health bar", function () {
    const player = makePlayer();
    player.takeDamage(50);
    spyOn(window, "image");
    spyOn(window, "noStroke");
    spyOn(window, "fill");
    spyOn(window, "rect");

    player.draw();

    expect(player.getHealthRatio()).toBe(0.5);
    expect(window.rect).toHaveBeenCalledWith(105, 125, 40, 5);
    expect(window.rect).toHaveBeenCalledWith(105, 125, 20, 5);
  });

  it("reduces health by damage without going below zero", function () {
    const player = makePlayer();

    expect(player.takeDamage(35)).toBe(35);
    expect(player.health).toBe(65);
    expect(player.getHealthRatio()).toBeCloseTo(0.65);

    expect(player.takeDamage(100)).toBe(65);
    expect(player.health).toBe(0);
    expect(player.isDead()).toBeTrue();
  });

  it("rejects invalid damage and leaves health unchanged", function () {
    const player = makePlayer();
    spyOn(console, "error");

    expect(player.takeDamage(-1)).toBe(0);
    expect(player.takeDamage(Infinity)).toBe(0);
    expect(player.health).toBe(100);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("resets health after death", function () {
    const player = makePlayer();
    player.takeDamage(100);

    player.resetHealth();

    expect(player.health).toBe(100);
    expect(player.isDead()).toBeFalse();
  });
});

describe("Death screen buttons", function () {
  let testPlayer;

  beforeEach(function () {
    width = 1000;
    height = 600;
    testPlayer = {
      health: 0,
      x: 10,
      y: 20,
      current_image: 4,
      count: 2,
      resetHealth: jasmine.createSpy("resetHealth")
    };
    player = testPlayer;
    not_generated = false;
    selectedCharacter = 2;
  });

  it("places two non-overlapping buttons at the bottom of the death screen", function () {
    const restart = deathButtonBounds(0);
    const mainMenu = deathButtonBounds(1);

    expect(restart.width).toBe(220);
    expect(restart.height).toBe(60);
    expect(mainMenu.x).toBeGreaterThan(restart.x + restart.width);
    expect(restart.y).toBe(440);
    mouseX = restart.x + 1;
    mouseY = restart.y + 1;
    expect(deathButtonHovered(0)).toBeTrue();
    mouseX = 0;
    mouseY = 0;
    expect(deathButtonHovered(0)).toBeFalse();
  });

  it("draws both death-screen buttons", function () {
    spyOn(window, "background");
    spyOn(window, "cursor");
    spyOn(window, "drawDeathButton");

    drawDeathScreen();

    expect(window.background).toHaveBeenCalledWith(20, 16, 40);
    expect(window.drawDeathButton).toHaveBeenCalledWith(0, "Restart");
    expect(window.drawDeathButton).toHaveBeenCalledWith(1, "Main Menu");
  });

  it("restarts the game with reset player state", function () {
    restartGame();

    expect(testPlayer.resetHealth).toHaveBeenCalled();
    expect(testPlayer.x).toBe(475);
    expect(testPlayer.y).toBe(275);
    expect(testPlayer.current_image).toBe(0);
    expect(testPlayer.count).toBe(7);
    expect(not_generated).toBeTrue();
    expect(scene_num).toBe(2);
  });

  it("returns to the main menu and resets character selection", function () {
    returnToMainMenu();

    expect(testPlayer.resetHealth).toHaveBeenCalled();
    expect(not_generated).toBeTrue();
    expect(selectedCharacter).toBe(0);
    expect(scene_num).toBe(0);
  });
});
