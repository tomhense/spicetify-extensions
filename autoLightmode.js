//@ts-check

// NAME: AutoLightmode
// AUTHOR: Codedotexe
// DESCRIPTION: Add a button to switch between dark and light colorscheme, requires additional setup

/// <reference path="../globals.d.ts" />

(function autoLightmode() {
	const checkDarkModeServer = "http://127.0.0.1:8160";
	const checkDarkModeServerEnabled = false;

	if (!Spicetify.Keyboard) {
		setTimeout(autoLightmode, 1000);
		return;
	}

	function toggleLightmode() {
		document.body.classList.add("lightmode-manual");
		if (document.body.classList.contains("lightmode")) {
			document.body.classList.remove("lightmode");
		} else {
			document.body.classList.add("lightmode");
		}
	}

	async function checkServer() {
		if (!checkDarkModeServerEnabled) return;
		const res = await fetch(checkDarkModeServer, { method: "GET", headers: { "Content-Type": "application/json" } })
			.then((res) => res.json())
			.catch((err) => console.error(err));

		if (document.body.classList.contains("lightmode-manual")) return; // Don't override manual theme

		if (res.theme === "light") {
			document.body.classList.add("lightmode");
		} else if (res.theme === "dark") {
			document.body.classList.remove("lightmode");
		}
	}

	const iconSVG = `<svg width="20" height="20" version="1.1" viewBox="0 0 20 20" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
		<circle cx="10" cy="10" r="10" fill="#000"/>
		<path d="m10 14a4 4 0 0 0 0-8z" fill="#fff"/>
		<path d="m10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 2v4a4 4 0 1 0 0 8v4a8 8 0 1 0 0-16z" clip-rule="evenodd" fill="#fff" fill-rule="evenodd"/>
	</svg>`;

	new Spicetify.Topbar.Button("Switch theme", iconSVG, toggleLightmode);

	Spicetify.Keyboard.registerShortcut(
		{
			key: Spicetify.Keyboard.KEYS["N"],
			ctrl: true,
			shift: false,
			alt: false,
		},
		toggleLightmode
	);

	if (checkDarkModeServerEnabled) {
		setInterval(checkServer, 1000 * 30);
		checkServer();
	}
})();
