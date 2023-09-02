//@ts-check

// NAME: SidebarToggle
// AUTHOR: Codedotexe
// DESCRIPTION: Add a button to toggle the spotify sidebar

/// <reference path="../globals.d.ts" />

(function sidebarToggle() {
	if (!Spicetify.Keyboard) {
		setTimeout(sidebarToggle, 1000);
		return;
	}

	function toggleSidebar() {
		const sidebarContainer = document.querySelector('.Root__nav-bar');
		if (sidebarContainer.style.display == 'none') {
			sidebarContainer.style.display = '';
		} else {
			sidebarContainer.style.display = 'none';
		}
	}

	new Spicetify.Topbar.Button('Toggle sidebar', `<svg class="bi bi-layout-sidebar" width="20" height="20" fill="currentColor" version="1.1" viewBox="0 0 16 16" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,1)" fill="#fff" fill-rule="evenodd"><path d="m14 1h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2z"/><path d="m4 13v-12h1v12z"/></g></svg>`, toggleSidebar);
	
	Spicetify.Keyboard.registerShortcut({
		key: Spicetify.Keyboard.KEYS["B"], 
		ctrl: true, 
		shift: false,
		alt: false
	}, toggleSidebar);
})();
