from flask import Flask
from database.db import db_connect
from utils.Response import Response
app = Flask(__name__)

@app.route('/')
def hello_world():
    conn = db_connect()
    # Example query
     
    return Response(data="Hello, World!", message="Success", status_code=200)

if __name__ == '__main__':
    app.run(port = 8080, debug=True)