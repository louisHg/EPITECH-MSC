from flask import Flask
from config import config
from flasgger import Swagger
from datetime import timedelta
from flask_jwt_extended import JWTManager  # Import JWTManager
from flask_cors import CORS



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

Swagger(app)

app.config['SECRET_KEY'] = config['SECRET_KEY']
app.config['DATABASE_HOST'] = config['DATABASE_HOST']
app.config['DATABASE_NAME'] = config['DATABASE_NAME']
app.config['DATABASE_USER'] = config['DATABASE_USER']
app.config['DATABASE_PASSWORD'] = config['DATABASE_PASSWORD']

# PostgreSQL Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{app.config['DATABASE_USER']}:{app.config['DATABASE_PASSWORD']}@{app.config['DATABASE_HOST']}/{app.config['DATABASE_NAME']}"

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)


# JWT Configuration with Expiration Times
app.config['JWT_SECRET_KEY'] = 'zjifnzknfzjnzzfnjizfnjfznioznfujfziunzfujnzujfziujnfziunzf'  # Replace with your secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)  # 30 seconds for access token expiration
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(minutes=1)  # 1 minute for refresh token expiration

# Initialize JWTManager
jwt = JWTManager(app)

from controller import userController
