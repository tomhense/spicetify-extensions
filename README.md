# AutoLightmode
This is a script which adds a small button to the top toolbar to switch between light and dark themes. This script alone only toggles a class tag on the body you will still have to modify a theme to use this.

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

For every color section in this file we will have to add the color codes for the light theme (it is easiest to just copy this together):
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
Adds a context menu entry when you right click on a artist entry, this entry allows you to view which genres this artist is associated with (using the spotify api).\

# Songstats
Adds a context menu entry when you right on a track, this entry statistics like BPM about of track (using the spotify api).

# Scrollseek
Allows you to seek the track by scrolling on the progressbar (it is still a bit rough at the moment).
