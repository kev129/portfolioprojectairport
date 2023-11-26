from flask import Flask, jsonify
from airports import render_flights, load_airport_data, get_search, find_airports_by_name, get_scheduled_flights_from_icao

app = Flask(__name__)


@app.route('/get_flights', methods=['GET'])
def get_flights():
    search_term = get_search()
    users_selection = find_airports_by_name(search_term, load_airport_data)

    if users_selection is None:
        return jsonify({"error": "Invalid airport"})

    departure_icao = users_selection["icao"]
    user_airport_flights = get_scheduled_flights_from_icao(departure_icao)

    return jsonify({"flights": user_airport_flights})


if __name__ == '__main__':
    app.run(debug=True)
