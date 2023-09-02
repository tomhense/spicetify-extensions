#!/bin/sh

TEMPDIR="$(mktemp -d )"

SPICETIFY_EXT="${XDG_CONFIG_DIR:-$HOME/.config}/spicetify/Extensions"

if ! [ -d "$SPICETIFY_EXT" ]; then
	echo "Could not find spicetify extension dir '$SPICETIFY_EXT'" >&2
	exit 1
fi

git clone 'https://github.com/spicetify/spicetify-cli.git' "$TEMPDIR"
env cp -v "$TEMPDIR/Extensions"/* "$SPICETIFY_EXT"
env rm -drf "$TEMPDIR"

echo 'Finished'
