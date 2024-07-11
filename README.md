# AutoLightmode

This is a script which adds a small button to the top toolbar to switch between light and dark themes. This script alone only toggles a class tag on the body you will still have to modify a theme to use this.

#### Detect darkmode server (linux only)

I now added a option to the script that enables it to periodically query a small selfhosted server on your PC so that the spotify dark/light mode is syned to your system theme. You can still use the toggle button, this will set script into manual mode and the theme will not be changed automatically anymore (until you restart the application). To use this you will need run the this detect-darkmode-server on your PC (the code is in this repo). The serer determines the system theme using dbus and simply serves it, because dbus is a linux thing this functionality is currently only availble on linux.

### Modifying a theme

Add this small snippet at the top of `user.css` file of the theme you want to add the dark/light mode capability to:

```css
body.lightmode {
	--spice-text: var(--spice-light-text);
	--spice-subtext: var(--spice-light-subtext);
	--spice-main: var(--spice-light-main);
	--spice-sidebar: var(--spice-light-sidebar);
	--spice-player: var(--spice-light-player);
	--spice-card: var(--spice-light-card);
	--spice-shadow: var(--spice-light-shadow);
	--spice-selected-row: var(--spice-light-selected-row);
	--spice-button: var(--spice-light-button);
	--spice-button-active: var(--spice-light-button-active);
	--spice-button-disabled: var(--spice-light-button-disabled);
	--spice-tab-active: var(--spice-light-tab-active);
	--spice-notification: var(--spice-light-notification);
	--spice-notification-error: var(--spice-light-notification-error);
	--spice-misc: var(--spice-light-misc);
}
```

Now we have to modify the `color.ini` file of the theme:

For example:

```
[gray]
text               = 000000
subtext            = 000000
main               = 000000
sidebar            = 000000
player             = 000000
card               = 000000
shadow             = 000000
selected-row       = 000000
button             = 000000
button-active      = 000000
button-disabled    = 000000
tab-active         = 000000
notification       = 000000
notification-error = 000000
misc               = 000000
```

For every color section in this file we will have to add the color codes for the light theme (it is easiest to just copy this together if the theme already contains sections for light colors):

```
[gray]
text               = 000000
subtext            = 000000
main               = 000000
sidebar            = 000000
player             = 000000
card               = 000000
shadow             = 000000
selected-row       = 000000
button             = 000000
button-active      = 000000
button-disabled    = 000000
tab-active         = 000000
notification       = 000000
notification-error = 000000
misc               = 000000
light-text               = 000000
light-subtext            = 000000
light-main               = 000000
light-sidebar            = 000000
light-player             = 000000
light-card               = 000000
light-shadow             = 000000
light-selected-row       = 000000
light-button             = 000000
light-button-active      = 000000
light-button-disabled    = 000000
light-tab-active         = 000000
light-notification       = 000000
light-notification-error = 000000
light-misc               = 000000
```

# GenresInfo

Adds a context menu entry when you right click on a artist entry, this entry allows you to view which genres this artist is associated with (using the spotify api).

# Songstats

Adds a context menu entry when you right on a track, this entry statistics like BPM about of track (using the spotify api).

# Scrollseek

Allows you to seek the track by scrolling on the progressbar (it is still a bit rough at the moment).

# gptifyTunes

Adds a new recommend section in the playlist view, that allows generating new suggestions using OpenAI GPT (based on playlist name, description and contents). If you want to use this you will need your own OpenAI api key (you will be prompted for it). You will also need to run a CORS proxy on your computer (there is a example server in this repo) so that the script is able to communicate with OpenAI servers despite Spotify's CORS policies.
