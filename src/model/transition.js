const TRANSITION_TIMES = { fadeOut: 0.25, hold: 0.15, fadeIn: 0.25 }; // seconds

function createTransition() {
	return { active: false, timer: 0, swapped: false };
}

/** Starts a transition. Does nothing (returns false) if one is already running. */
function startTransition(t) {
	if (t.active) return false;
	t.active = true;
	t.timer = 0;
	t.swapped = false;
	return true;
}

/**
 * Advances the transition. Returns true on the one frame where the screen is
 * fully black and the game should swap to the new floor.
 */
function updateTransition(t, dt, times) {
	if (!t.active) return false;
	t.timer += dt;
	let swapNow = false;
	if (!t.swapped && t.timer >= times.fadeOut) {
		t.swapped = true;
		swapNow = true;
	}
	if (t.timer >= times.fadeOut + times.hold + times.fadeIn) {
		t.active = false;
		t.timer = 0;
		t.swapped = false;
	}
	return swapNow;
}

/** How black the screen should be: 0 = clear, 1 = fully black. */
function transitionAlpha(t, times) {
	if (!t.active) return 0;
	if (t.timer < times.fadeOut) return t.timer / times.fadeOut;
	if (t.timer < times.fadeOut + times.hold) return 1;
	return Math.max(0, 1 - (t.timer - times.fadeOut - times.hold) / times.fadeIn);
}

/** True once the player has walked far enough into the doorway (depth = wall thickness). */
function hasReachedDoor(playerY, innerY, depth) {
	return playerY <= innerY - depth / 2;
}