import json
import os
import airport_api
from typing import NoReturn


import requests
from dotenv import load_dotenv

load_dotenv()

airport_api_key = os.environ["airport_api_key"]
weather_api_key = os.environ["weather_api_key"]

user_response_json = airport_api.process_input()

user_response = json.loads(user_response_json)

print(user_response)
