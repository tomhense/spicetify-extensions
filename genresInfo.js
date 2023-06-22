//@ts-check

// NAME: GenresInfo
// AUTHOR: Codedotexe
// DESCRIPTION: Show the genres of a artist or a album

/// <reference path="../globals.d.ts" />

(function genresInfo() {
	const { CosmosAsync, ContextMenu, URI } = Spicetify;

	if (!(CosmosAsync && URI)) {
		setTimeout(genresInfo, 300);
		return;
	}

	async function showGenres(uris) {
		const uriObj = Spicetify.URI.fromString(uris[0]);
		const id = uris[0].split(":")[2];

		if (uriObj.type === Spicetify.URI.Type.ARTIST) {
			const res = await CosmosAsync.get("https://api.spotify.com/v1/artists/" + id);

			Spicetify.PopupModal.display({
				title: "Genres",
				content: res.genres.length > 0 ? `Genres: ${res.genres.join(", ")}` : "No genres found",
			});
		}
	}

	function isArtistURI(uris) {
		if (uris.length > 1) {
			return false;
		}
		const uri = uris[0];
		const uriObj = Spicetify.URI.fromString(uri);
		return uriObj.type === Spicetify.URI.Type.ARTIST;
	}

	const artistGenresContextMenu = new Spicetify.ContextMenu.Item("Show genres", showGenres, isArtistURI);
	artistGenresContextMenu.register();
})();
