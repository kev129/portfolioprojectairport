import json
from flask import Flask, render_template, request, jsonify
import airport
# from airports import render_flights, load_airport_data, get_search, find_airports_by_name, get_scheduled_flights_from_icao

app = Flask(__name__)

@app.route('/get_flights', methods=['GET'])
def get_flights():
    return airport.response()


@app.route('/process_input', methods=['POST'])
def process_input_route():

    return airport.process_input()


if __name__ == '__main__':
    app.run(debug=True)
