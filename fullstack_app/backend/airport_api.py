from flask import Flask
from flask_cors import CORS
import airport


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/get_flights', methods=['GET'])
def get_flights():
    return airport.response()


@app.route('/process_input', methods=['POST'])
def process_input_route():
    return airport.process_input()


if __name__ == '__main__':
    app.run(debug=True)
