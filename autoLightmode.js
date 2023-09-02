//@ts-check

// NAME: AutoLightmode
// AUTHOR: Codedotexe
// DESCRIPTION: Add a button to switch between dark and light colorscheme, requires additional setup

/// <reference path="../globals.d.ts" />

(function autoLightmode() {
	if (!Spicetify.Keyboard) {
		setTimeout(autoLightmode, 1000);
		return;
	}

	function toggleLightmode() {
		if (document.body.classList.contains("lightmode")) {
			document.body.classList.remove("lightmode");
		} else {
			document.body.classList.add("lightmode");
		}
	}

	new Spicetify.Topbar.Button('Switch theme', `<svg width="20" height="20" version="1.1" viewBox="0 0 20 20" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m10 14a4 4 0 0 0 0-8z" fill="#fff"/><path d="m10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 2v4a4 4 0 1 0 0 8v4a8 8 0 1 0 0-16z" clip-rule="evenodd" fill="#fff" fill-rule="evenodd"/></svg>`, toggleLightmode);
	
	Spicetify.Keyboard.registerShortcut({
		key: Spicetify.Keyboard.KEYS["N"], 
		ctrl: true, 
		shift: false,
		alt: false
	}, toggleLightmode);
})();
