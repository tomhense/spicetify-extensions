//@ts-check

// NAME: gptifyTunes
// AUTHOR: tomhe
// DESCRIPTION: View a songs stats, such as dancability and acousticness.

/// <reference path="../globals.d.ts" />

(function gptifyTunes() {
	const corsProxy = "http://localhost:8150";
	const openaiApiEndpoint = "https://api.openai.com/v1/chat/completions";
	const openaiModel = "gpt-3.5-turbo";

	const { CosmosAsync, URI } = Spicetify;
	if (!(CosmosAsync && URI)) {
		setTimeout(gptifyTunes, 300);
		return;
	}
	const local_language = Spicetify.Locale._locale;
	const translations = {
		en: {
			sectionTitle: "GPT Recommends",
			sectionTitleSubtext: "Based on LLM recommendations for this playlist",
			refreshButtonText: "Generate new recommendations",
			addButtonText: "Add",
		},
	}[local_language];

	// The container where to the current view (playlist, album, artist etc) is located in. We will use this to attach a MutationObserver to detect when the view changes and also as a reference point to find and add elements.
	const contentContainer = document.querySelector("div.main-view-container main");

	class PubSub {
		constructor() {
			this.subscribers = [];
		}

		subscribe(callback) {
			this.subscribers.push(callback);
			return () => {
				this.subscribers = this.subscribers.filter((sub) => sub !== callback);
			};
		}

		publish(data) {
			this.subscribers.forEach((callback) => callback(data));
		}
	}
	const pubSub = new PubSub();

	function TrackImage({ src, alt, playLabel }) {
		return Spicetify.React.createElement(
			"div",
			{ className: "main-trackList-rowImageWithPlay" },
			Spicetify.React.createElement("img", {
				"aria-hidden": "false",
				draggable: "false",
				loading: "eager",
				src: src,
				alt: alt,
				className: "main-image-image main-trackList-rowImage main-image-loaded",
				width: 40,
				height: 40,
				style: { borderRadius: "4px" },
			}),
			Spicetify.React.createElement(
				"button",
				{
					className: "main-trackList-rowImagePlayButton main-trackList-rowImagePlayPauseButton",
					"aria-label": playLabel,
					tabIndex: -1,
				},
				Spicetify.React.createElement(
					"svg",
					{
						"data-encore-id": "icon",
						role: "img",
						"aria-hidden": "true",
						className: "Svg-sc-ytk21e-0 Svg-img-icon-medium main-trackList-rowPlayPauseIcon",
						viewBox: "0 0 24 24",
					},
					Spicetify.React.createElement("path", { d: "m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" })
				)
			)
		);
	}

	function TrackDetails({ title, artistName, artistLink }) {
		return Spicetify.React.createElement(
			"div",
			{ className: "main-trackList-rowMainContent" },
			Spicetify.React.createElement(
				"div",
				{
					className: "encore-text encore-text-body-medium encore-internal-color-text-base main-trackList-rowTitle standalone-ellipsis-one-line",
					"data-encore-id": "text",
					dir: "auto",
				},
				title
			),
			Spicetify.React.createElement(
				"span",
				{
					className: "encore-text encore-text-body-small encore-internal-color-text-subdued UudGCx16EmBkuFPllvss standalone-ellipsis-one-line",
					"data-encore-id": "text",
				},
				Spicetify.React.createElement(
					"span",
					{
						className: "encore-text encore-text-body-small",
						"data-encore-id": "text",
					},
					Spicetify.React.createElement("a", { draggable: "true", dir: "auto", href: artistLink, tabIndex: -1 }, artistName)
				)
			)
		);
	}

	function TrackActions({ addButtonCallback }) {
		return Spicetify.React.createElement(
			"div",
			{
				className: "main-trackList-rowSectionEnd",
				role: "gridcell",
				"aria-colindex": 4,
			},
			Spicetify.React.createElement(
				"button",
				{
					"data-testid": "add-to-playlist-button",
					className: "Button-sc-y0gtbx-0 Button-small-buttonSecondary-useBrowserDefaultFocusStyle encore-text-body-small-bold",
					"aria-label": "Add to Playlist",
					"data-encore-id": "buttonSecondary",
					onClick: addButtonCallback,
					tabIndex: -1,
				},
				translations.addButtonText
			)
		);
	}

	function TrackListRow({ track, addButtonCallback, index, albumLink, albumName }) {
		const playCallback = () => {
			console.log(`Play ${track.title} by ${track.artistName}`);
			Spicetify.Player.playUri(`spotify:track:${track.id}`);
		};

		return Spicetify.React.createElement(
			"div",
			{
				role: "row",
				"aria-rowindex": index + 1,
				"aria-selected": "false",
			},
			Spicetify.React.createElement(
				"div",
				{
					className: "main-trackList-trackListRow main-trackList-trackListRowGrid main-trackList-isRecommendedTrackListRow",
					draggable: "true",
					role: "presentation",
				},
				Spicetify.React.createElement(
					"div",
					{
						className: "main-trackList-rowSectionStart",
						role: "gridcell",
						"aria-colindex": 1,
						onClick: playCallback,
					},
					Spicetify.React.createElement(TrackImage, {
						src: track.image,
						alt: "",
						playLabel: track.playLabel,
					}),
					Spicetify.React.createElement(TrackDetails, {
						title: track.title,
						artistName: track.artistName,
						artistLink: track.artistLink,
						albumName: track.albumName,
						albumLink: track.albumLink,
					})
				),
				Spicetify.React.createElement(
					"span",
					{
						className: "main-trackList-rowSectionVariable",
						role: "gridcell",
						"aria-colindex": 2,
					},
					Spicetify.React.createElement("a", { draggable: "true", className: "standalone-ellipsis-one-line", dir: "auto", href: albumLink, tabIndex: -1 }, albumName)
				),
				Spicetify.React.createElement(
					"div",
					{
						className: "main-trackList-rowSectionVariable",
						role: "gridcell",
						"aria-colindex": 3,
					},
					Spicetify.React.createElement("span", null)
				),
				Spicetify.React.createElement(TrackActions, {
					addButtonCallback: () => {
						addButtonCallback(track.id);
					},
				})
			)
		);
	}

	function RecommendedTrackList({ tracks, addButtonCallback }) {
		return Spicetify.React.createElement(
			"div",
			{
				role: "grid",
				"aria-rowcount": tracks.length,
				"aria-colcount": 4,
				"aria-label": "Recommended based on what’s in this playlist",
				className: "main-trackList-trackList",
				tabIndex: 0,
				style: { "--placeholder-image": "url(/images/tracklist-placeholder.png)", "--placeholder-image-compact": "url(/images/tracklist-placeholder-compact.png)" },
			},
			Spicetify.React.createElement(
				"div",
				{ className: "main-rootlist-wrapper", role: "presentation", style: { height: "560px", "--row-height": "56px" } },

				Spicetify.React.createElement(
					"div",
					{ role: "presentation", style: { transform: "translateY(0px);" } },
					tracks.map((track, index) => Spicetify.React.createElement(TrackListRow, { track, addButtonCallback, key: track.id, index: index, albumLink: track.albumLink, albumName: track.albumName }))
				)
			)
		);
	}

	function RecommendedSection({ refreshButtonCallback, addButtonCallback }) {
		const [tracks, setTracks] = Spicetify.React.useState([]);

		Spicetify.React.useEffect(() => {
			const unsubscribe = pubSub.subscribe((newTracks) => {
				setTracks(newTracks);
			});

			return unsubscribe;
		}, []);

		return Spicetify.React.createElement(
			"div",
			{ "data-testid": "recommended-track" },
			Spicetify.React.createElement(
				"div",
				{ className: "playlist-playlist-recommendedTrackList" },
				Spicetify.React.createElement(
					"div",
					{ className: "playlist-playlist-top" },
					Spicetify.React.createElement(
						"div",
						{ className: "playlist-playlist-header" },
						Spicetify.React.createElement(
							"span",
							{
								className: "encore-text encore-text-title-small",
								"data-encore-id": "text",
							},
							translations.sectionTitle
						),
						Spicetify.React.createElement(
							"span",
							{
								className: "encore-text encore-text-body-small playlist-playlist-subtitle",
								"data-encore-id": "text",
							},
							translations.sectionTitleSubtext
						)
					)
				),
				Spicetify.React.createElement(RecommendedTrackList, { tracks, addButtonCallback }),
				Spicetify.React.createElement(
					"button",
					{
						className: "Button-sc-1dqy6lx-0 Button-medium-medium-buttonTertiary-useBrowserDefaultFocusStyle encore-text-body-medium-bold playlist-playlist-refreshButton",
						"data-encore-id": "buttonTertiary",
						onClick: refreshButtonCallback,
					},
					translations.refreshButtonText
				)
			)
		);
	}

	async function fetchPlaylistTracks(playlistId, offset = 0, limit = 50) {
		let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;
		let tracks = [];

		while (url) {
			const resp = await CosmosAsync.get(url);
			tracks.push(...resp.items);
			if (resp.next) url = tracks.next;
		}

		return tracks;
	}

	async function fetchPlaylist(playlistId) {
		const resp = await CosmosAsync.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
		if (resp.tracks.total > resp.tracks.items.length) {
			// We need to fetch more tracks (use a offset to not fetch the same tracks again)
			const tracks = await fetchPlaylistTracks(playlistId, resp.tracks.items.length);
			resp.tracks.items.push(...tracks);
		}
		return resp;
	}

	async function questionGPT(messages) {
		// Load the OpenAI API key from the local storage or prompt the user to enter it
		let openaiApiKey = Spicetify.LocalStorage.get("openaiApiKey");
		if (!openaiApiKey) {
			openaiApiKey = prompt("Please enter your OpenAI API key");
			if (openaiApiKey && openaiApiKey.startsWith("sk")) {
				Spicetify.LocalStorage.set("openaiApiKey", openaiApiKey);
			} else {
				console.log("Invalid API key");
			}
		}

		return await window
			.fetch(`${corsProxy}/${openaiApiEndpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${openaiApiKey}`,
				},
				body: JSON.stringify({
					messages: messages,
					model: openaiModel,
				}),
			})
			.then((resp) => resp.json())
			.then((data) => data.choices[0].message)
			.catch((err) => {
				console.error(err);
			});
	}

	async function searchTrack(searchTerm) {
		const resp = await CosmosAsync.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`);
		return resp.tracks.items.length > 0 ? resp.tracks.items[0] : null;
	}

	async function generateGPTRecommendations(playlistId, recommendAmount = 10) {
		// We use the session storage to store the chat messages so we can continue the conversation later
		const previousChatMessages = window.sessionStorage.getItem(`gpt-chat-playlist-${playlistId}`);

		let messages = [];
		if (previousChatMessages) {
			messages = JSON.parse(previousChatMessages);
			messages.push({
				role: "user",
				content: `Recommend ${recommendAmount} more tracks`,
			});
		} else {
			const playlist = await fetchPlaylist(playlistId);
			messages = [
				{
					role: "system",
					content: `You are a GPT Recommender AI. You are given a playlist and asked to recommend ${recommendAmount} more tracks that fit in the playlist. Your input is in JSON format and your output should be in JSON format. The output should be in this format: [ { title: 'Track Title', artists: ['Artist 1', 'Artist 2'], album: 'Album Name' }, ... ]`,
				},
				{
					role: "user",
					content: JSON.stringify({
						name: playlist.name,
						description: playlist.description || "",
						tracks: playlist.tracks.items.map((track) => {
							return {
								title: track.track.name,
								artists: track.track.artists.map((artist) => artist.name),
								album: track.track.album.name,
							};
						}),
					}),
				},
			];
		}

		const completionMessage = await questionGPT(messages);
		if (completionMessage) {
			// Save the new messages
			messages.push(completionMessage);
			window.sessionStorage.setItem(`gpt-chat-playlist-${playlistId}`, JSON.stringify(messages));

			// Parse the completion text
			const completionJSON = JSON.parse(completionMessage.content);
			console.log(completionJSON);
			const recommendationsPromises = completionJSON.map(async (track) => {
				return searchTrack(`${track.title} ${track.artists[0]}`).then((track) => {
					return {
						id: track.id,
						image: track.album.images[0].url,
						playLabel: `Play ${track.name} by ${track.artists[0].name}`,
						title: track.name,
						artistName: track.artists[0].name,
						artistLink: `/artist/${track.artists[0].id}`,
						albumName: track.album.name,
						albumLink: `/album/${track.album.id}`,
					};
				});
			});
			// We do it like this so the search is done in parallel we can still return resolved promises
			return await Promise.all(recommendationsPromises);
		}

		return []; // Return empty array if something went wrong
	}

	async function addRecommendedSection(playlistId) {
		const refreshButtonCallback = async () => {
			pubSub.publish(await generateGPTRecommendations(playlistId));
		};
		const addButtonCallback = async (trackId) => {
			CosmosAsync.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
				uris: [`spotify:track:${trackId}`],
			});
		};

		const recommendedSection = Spicetify.React.createElement(RecommendedSection, { refreshButtonCallback, addButtonCallback });
		const targetContainer = contentContainer?.querySelector("div[data-testid='recommended-track']");
		const innerContainer = document.createElement("div");

		// We need to create a seperate inner div and delay execution so that our new section is located at the bottom of the container (and not the start)
		setTimeout(() => {
			targetContainer?.appendChild(innerContainer);
			Spicetify.ReactDOM.render(recommendedSection, innerContainer);
		}, 1000);
	}

	function mutationCallback() {
		const currentView = contentContainer.querySelector("section");
		if (!currentView) return;
		const contentCategory = currentView.getAttribute("data-testid");
		const contentUri = currentView.getAttribute("data-test-uri");

		// Check if the current selected view is a playlist page
		if (contentCategory == "playlist-page" && contentUri?.startsWith("spotify:playlist:")) {
			addRecommendedSection(contentUri.split(":")[2]);
		}
	}

	if (contentContainer) {
		// We use a Mutation observer to detect when the changes to the direct children of the content container. These will change if we navigate to a new view (playlist, album, artist etc) and should not change much normally. When a change is detected we simply find the current view and check if it is a playlist page. If it is we add the recommended section.
		const mutationObserver = new MutationObserver(mutationCallback);
		mutationObserver.observe(contentContainer, {
			childList: true,
		});

		mutationCallback(); // Call the mutation callback once to check if we are already on a playlist page
	}
})();
