describe("transition", function () {
	const T = { fadeOut: 1, hold: 1, fadeIn: 1 };

	it("does not start twice", function () {
		const t = createTransition();
		expect(startTransition(t)).toBe(true);
		expect(startTransition(t)).toBe(false);
	});

	it("swaps floors exactly once, when the screen is black", function () {
		const t = createTransition();
		startTransition(t);
		expect(updateTransition(t, 0.5, T)).toBe(false);
		expect(updateTransition(t, 0.6, T)).toBe(true);
		expect(transitionAlpha(t, T)).toBe(1);
		expect(updateTransition(t, 0.5, T)).toBe(false);
	});

	it("fades in and then finishes", function () {
		const t = createTransition();
		startTransition(t);
		updateTransition(t, 2.5, T);
		expect(transitionAlpha(t, T)).toBeCloseTo(0.5);
		updateTransition(t, 1, T);
		expect(t.active).toBe(false);
		expect(transitionAlpha(t, T)).toBe(0);
	});
});

describe("hasReachedDoor", function () {
	it("triggers once the player is halfway into the doorway", function () {
		expect(hasReachedDoor(100, 100, 40)).toBe(false);
		expect(hasReachedDoor(80, 100, 40)).toBe(true);
	});
});