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


def process_input() -> json:
    """Takes response from flask app and return json object with user search query, and message

    Returns:
        json: users input, message
    """

    try:
        user_input = request.json['user_input']
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


if __name__ == "__main__":
    search_term = process_input()
