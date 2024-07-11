const http = require("http");
const url = require("url");
const dbus = require("dbus-native");

// Function to query D-Bus endpoint
async function queryDbus() {
	const sessionBus = dbus.sessionBus();
	if (!sessionBus) {
		throw new Error("Could not connect to the session bus.");
	}

	return new Promise((resolve, reject) => {
		sessionBus.getService("org.freedesktop.portal.Desktop").getInterface("/org/freedesktop/portal/desktop", "org.freedesktop.portal.Settings", (err, iface) => {
			if (err) {
				reject("Failed to request service interface: " + err);
				return;
			}

			iface.Read("org.freedesktop.appearance", "color-scheme", (err, value) => {
				if (err) {
					reject("Error reading value: " + err);
				} else {
					resolve(value[1][0][1][0]);
				}
			});
		});
	});
}

// Function to handle CORS
function setCORSHeaders(response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "GET");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	response.setHeader("Access-Control-Expose-Headers", "access-control-allow-origin");
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
	setCORSHeaders(res);

	const reqUrl = url.parse(req.url, true);
	try {
		const value = await queryDbus();
		let theme;
		if (value == "1") {
			theme = "dark";
		} else if (value == "0" || value == "2") {
			theme = "light";
		} else {
			console.error("Unknown value: " + value);
		}

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ theme }));
	} catch (err) {
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: err.message }));
	}
});

// Define port and start the server
const port = 8160;
server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
