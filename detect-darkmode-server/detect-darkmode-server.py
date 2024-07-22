#!/usr/bin/env python3
import dbus
from flask import Flask, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Apply CORS to the Flask app


# Function to query D-Bus endpoint
def query_dbus():
    try:
        session_bus = dbus.SessionBus()
        proxy = session_bus.get_object("org.freedesktop.portal.Desktop", "/org/freedesktop/portal/desktop")
        iface = dbus.Interface(proxy, "org.freedesktop.portal.Settings")
        value = iface.Read("org.freedesktop.appearance", "color-scheme")

        # Directly returning the integer value from the dbus.UInt32 object
        return int(value)
    except dbus.DBusException as exc:
        raise RuntimeError(f"Error reading value: {str(exc)}")


@app.route("/", methods=["GET"])
def get_theme():
    try:
        value = query_dbus()
        if value == 1:
            theme = "dark"
        elif value == 0 or value == 2:
            theme = "light"
        else:
            response = make_response(jsonify({"error": "Unknown value: " + str(value)}), 500)
            return response

        return jsonify({"theme": theme})
    except RuntimeError as err:
        response = make_response(jsonify({"error": str(err)}), 500)
        return response


if __name__ == "__main__":
    port = 8160
    app.run(host="127.0.0.1", port=port)
