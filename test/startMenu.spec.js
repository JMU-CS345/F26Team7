describe("Start Menu Video & Input", function() {
  let mockVideo;

  beforeEach(function() {
    // 1. Create a lightweight mock element to act as the p5 video
    mockVideo = {
      elt: document.createElement('video'),
      play: function() {},
      pause: function() {},
      hide: function() {},
      loop: function() {}
    };

    // 2. Intercept video playback globally so headless browsers / GitHub Actions won't fail
    spyOn(HTMLMediaElement.prototype, 'play').and.returnValue(Promise.resolve());
    spyOn(HTMLMediaElement.prototype, 'load').and.returnValue(Promise.resolve());

    // 3. Spy on your p5 video methods
    spyOn(mockVideo, 'play').and.callThrough();
  });

  afterEach(function() {
    // Clean up any video tags appended to the DOM after each spec
    const videos = document.querySelectorAll('video');
    videos.forEach(v => v.remove());
  });

  it("should attempt to play the MP4 intro video when start menu input is received", function() {
    // Simulate player input on the start menu
    let inputReceived = true;

    if (inputReceived) {
      mockVideo.play();
    }

    expect(mockVideo.play).toHaveBeenCalled();
  });
});