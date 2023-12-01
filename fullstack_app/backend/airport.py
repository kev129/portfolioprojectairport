import json
import os
import airport_api
from typing import NoReturn


import requests
from dotenv import load_dotenv
from flask import request, jsonify

load_dotenv()

airport_api_key = os.environ["airport_api_key"]
weather_api_key = os.environ["weather_api_key"]


search_term = None


def process_input() -> json:
    """Takes response from flask app and return json object with user search query, and message

    Returns:
        json: users input, message
    """

    global search_term
    try:

        # search_term = user_input
        # print(user_input)
        user_input = request.json['user_input']
        search_term = user_input
        print(user_input)
        return jsonify({"user_input": user_input, "message": "Input received successfully"})

    except KeyError:

        return jsonify({"error": "Invalid request. 'user_input' key is missing."}), 400


def load_airport_data() -> dict:
    """Opens airport.json file and loads it, to access airport data. Data structure: {
      "name": "",
      "city": "",
      "country": "",
      "IATA": "",
      "icao": "",
      "lat": "",
      "lon": "",
      "timezone": ""
    }

      Returns:
          list: List of dictionaries containing airports and information
    """
    with open("airports2.json", encoding="utf-8") as airport_file:
        airport_list = json.load(airport_file)
    return airport_list


def find_airport_by_name(name: str, airport_list: list[dict]) -> dict:
    """Takes search term, iterates through airport list and finds match for the airport

    Args:
        name (str): users search term passed from front end
        airport_list (list[dict]): list of dicts containing airport and info relating to it

    Returns:
        dict: Matched airport dict containing its info
    """
    airport_match = [
        airport for airport in airport_list if name.lower() in airport["name"].lower()
    ]
    return airport_match


def find_airports_by_icao(icao: str, airport_list: list[dict]) -> dict:
    """Takes an Icao, and searches the Icao key in the airport data, returns a single match

    Args:
        Icao (str): The ICAO code of the airport to search for.
        airport_data (list): List containing airport dictionaries

    Returns:
        dict: Airport dictionary
    """

    if icao:
        for airport in airport_list:
            if icao.upper() == str(airport["icao"]).upper():
                return airport
    return None


def get_scheduled_flights_from_icao(icao: str) -> json:
    """Searches airport API, using icao for scheduled flights and returns JSON Object of
    flights and data

    Args:
        Icao (str): Airport Icao

    Returns:
        json: JSON Object containing flights and information of flights
    """
    try:
        response = requests.get(
            f"https://airlabs.co/api/v9/schedules?dep_icao={icao}&api_key="
            f"{airport_api_key}",
            timeout=15,
        ).json()
    except requests.exceptions.Timeout:
        print("Request timed out. Please try again later.")

    except requests.exceptions.ConnectionError:
        print(
            "Failed to connect to server. Please check your internet connection and try again."
        )

    except requests.exceptions.RequestException as error:
        print(f"An error occurred while making the request: {error}")

    return response


def get_current_weather_for_location(lat: str, lng: str) -> json:
    """Takes in a longitude and latitude, and gets the current weather for the associated

    location returns a json object containing data

    Args:
        lat (str): latitude of location
        lng (str): longitude of location

    Returns:
        json: JSON Object containing weather information
    """
    try:
        response = requests.get(
            f"http://api.weatherapi.com/v1/current.json?key={weather_api_key}="
            f"{lat},{lng}",
            timeout=15,
        ).json()

    except requests.exceptions.Timeout:
        print("Request timed out. Please try again later.")

    except requests.exceptions.ConnectionError:
        print(
            "Failed to connect to server. Please check your internet connection and try again."
        )

    except requests.exceptions.RequestException as error:
        print(f"An error occurred while making the request: {error}")

    return response


def get_airport_data_by_key(airport: dict, key: str) -> str:
    """Takes an airport dict, and returns a value based on key

    Args:
        airport (dict): Airport Dict containing information about airport
        key (str): Dict key that needs to be accessed

    Returns:
        str: Dict Value
    """
    if airport:
        value = airport[key]
        return value
    else:
        return None


def get_weather_data_for_destination(icao: str, airport_list: list) -> json:
    """Takes Icao, finds the airport, and gets the longitude and latitude, returns
    a json object with weather data

    Args:
        icao (str): Airport Icao from list of flights
        airport_list (list): List of airports, containing data about airport

    Returns:
        json: JSON Object containing weather data from weather API
    """
    destination_airport = find_airports_by_icao(icao, airport_list)

    destination_lat = get_airport_data_by_key(destination_airport, "lat")
    destination_lon = get_airport_data_by_key(destination_airport, "lon")

    return get_current_weather_for_location(destination_lat, destination_lon)


def get_current_temperature(data: dict) -> str:
    """Takes the destination dict, and returns the current temperature

    Args:
        data (dict): Location dict containing information about location

    Returns:
        str: Temperature of location degrees c
    """
    return data["current"]["temp_c"]


def get_current_weather(data: dict) -> str:
    """Takes the destination dict, and returns the current weather condition

    Args:
        data (dict): Location dict containing information about location

    Returns:
        str: Weather condition
    """
    return data["current"]["condition"]["text"]


def create_flight_info_json(flights: dict, airport_list: list, selected_airport: str) -> json:
    """Takes the list of flights for a given airport, builds json with info about flight and destination weather

    Args:
        flights (dict): Dict of request and response, including list of flights
        dicts from airport API
        airport_list (list): List of airports from airport JSON

    Returns:
        json: json object of flight no. , dep_time, destination_name, minutes delayed, and weather
    """
    flight_response = flights["response"]

    flight_numbers_seen = set()
    flights = []

    for flight in flight_response:
        # if flight['arr_icao']:
        if flight["cs_flight_iata"] not in flight_numbers_seen:
            arrival_icao = flight["arr_icao"]
            print(f"Checking {arrival_icao}...")
            weather_data = get_weather_data_for_destination(
                arrival_icao, airport_list)
            destination_temperature = get_current_temperature(weather_data)
            destination_weather_text = get_current_weather(weather_data)

            destination_airport = find_airports_by_icao(
                arrival_icao, airport_data)

            if destination_airport:
                destination_name = destination_airport['name']
            else:
                destination_name = 'Error'
            if flight["cs_flight_iata"]:
                flights.append({'flight_no': flight["cs_flight_iata"],
                                'flight_dep_time': flight['dep_time'],
                                'destination_name': destination_name,
                                'delay_time': str(flight["delayed"]),
                                'weather': str(destination_temperature) + "°C" + " - " + destination_weather_text, })

                flight_numbers_seen.add(flight["cs_flight_iata"])

    flight_info = {'flights': flights, 'response': 'Success',
                   'selected_airport': selected_airport[0]['name']}

    print('Flights successfully retrieved')
    return jsonify(flight_info)


airport_data = load_airport_data()


def response() -> json:

    if search_term == None:
        return {'response': 'Error'}
    else:
        selected_airport = find_airport_by_name(search_term, airport_data)

        departure_icao = selected_airport[0]["icao"]
        # departure_airport = find_airports_by_icao(departure_icao, airport_data)
        scheduled_flights = get_scheduled_flights_from_icao(departure_icao)

        flight_json = create_flight_info_json(
            scheduled_flights, airport_data, selected_airport)
        return flight_json
