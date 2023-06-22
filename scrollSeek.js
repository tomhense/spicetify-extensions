//@ts-check

// NAME: ScrollSeek
// AUTHOR: Codedotexe
// DESCRIPTION: Seek the song by scrolling over the progress bar

/// <reference path="../globals.d.ts" />

(function scrollSeek() {
	const { CosmosAsync, ContextMenu, URI } = Spicetify;

	if (!(CosmosAsync && URI)) {
		setTimeout(scrollSeek, 300);
		return;
	}

	const useConstantSpeed = true; // If true, the amount of time to seek will be constant, regardless of the scroll speed
	const seekSpeed = 100; // Change this to change the amount of time to seek

	const progressbar = document.querySelector(".playback-bar .progress-bar");
	if (progressbar !== null) {
		progressbar.addEventListener("wheel", (e) => {
			if (useConstantSpeed) {
				// The constant 10 is a value which represents a fixed e.deltaY value, I just chose 10 arbitrarily
				Spicetify.Player.skipForward(-Math.sign(e.deltaY) * 10 * seekSpeed);
			} else {
				Spicetify.Player.skipForward(-e.deltaY * seekSpeed);
			}
		});
	}
})();
