import os
from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def get_weather():
    if not API_KEY:
        return jsonify({"error": "Server missing API key"}), 500

    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    params = {"appid": API_KEY, "units": "metric"}
    if city:
        params["q"] = city
    elif lat and lon:
        params["lat"] = lat
        params["lon"] = lon
    else:
        return jsonify({"error": "Provide ?city=... or ?lat=...&lon=..."}), 400

    try:
        resp = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.exceptions.RequestException:
        return jsonify({"error": "Failed to fetch data from OpenWeatherMap"}), 500

if __name__ == "__main__":
    app.run(debug=True)
