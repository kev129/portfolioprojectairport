import json
import os
from typing import NoReturn

import requests
from dotenv import load_dotenv

load_dotenv()

airport_api_key = os.environ["airport_api_key"]
weather_api_key = os.environ["weather_api_key"]
