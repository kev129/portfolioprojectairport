from flask import Flask
from flask_cors import CORS
import airport


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
def home():
    return 'Welcome to airport API'


@app.route('/get_flights', methods=['GET'])
def get_flights():
    return airport.response(), 200


@app.route('/process_input', methods=['POST'])
def process_input_route():
    return airport.process_input(), 200


if __name__ == '__main__':
    app.run(debug=False)
