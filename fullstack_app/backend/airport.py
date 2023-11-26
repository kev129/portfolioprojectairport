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


def process_input():
    try:
        user_input = request.json['user_input']
        print(user_input)
        return jsonify({"user_input": user_input, "message": "Input received successfully"})

    except KeyError:

        return jsonify({"error": "Invalid request. 'user_input' key is missing."}), 400
