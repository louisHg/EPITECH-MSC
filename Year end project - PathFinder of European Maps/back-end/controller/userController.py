from controller import app, db
from flask import jsonify, request
from controller.models import Users  # Import your Users model
import bcrypt
from flasgger.utils import swag_from  # Import the swag_from decorator
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
# from map_class import Map

# Get all users
@app.route('/api/users', methods=['GET'])
@swag_from({
    'tags': ['User'],  # Specify the category as 'User'
    'responses': {
        200: {
            'description': 'A list of all users.'
        },
        404: {
            'description': 'No data found.'
        }
    }
})
def fetch_all_users():
    try:
        users = Users.query.all()
        if users:
            user_list = [{'id': user.id, 'fname': user.fname, 'lname': user.lname, 'gender': user.gender, 'email': user.email, 'password': user.password, 'phone': user.phone} for user in users]
            return jsonify({"data": user_list}), 200
        else:
            return jsonify({"message": "No data found"}, 404)
    except Exception as e:
        print(e)

# Get single user by user id
@app.route('/api/user/<int:id>', methods=['GET'])
@swag_from({
    'tags': ['User'],  # Specify the category as 'User'
    'parameters': [
        {
            'name': 'id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'The ID of the user.'
        }
    ],
    'responses': {
        200: {
            'description': 'User data.'
        },
        404: {
            'description': 'User not found.'
        }
    }
})
def fetch_single_user(id):
    try:
        user = Users.query.get(id)
        if user:
            user_data = {
                'id': user.id,
                'fname': user.fname,
                'lname': user.lname,
                'gender': user.gender,
                'email': user.email,
                'password': user.password,
                'phone': user.phone
            }
            return jsonify({"data": user_data}), 200
        else:
            return jsonify({"error": "User not found ☹️"}), 404
    except Exception as e:
        print(e)

# Create new user in the database with hashed password
@app.route('/api/register', methods=['POST'])
def register():
    try:
        if request.is_json and request.method == 'POST':
            data = request.get_json()

            fname = data.get('first_name')
            lname = data.get('last_name')
            gender = data.get('gender')
            email = data.get('email')
            password = data.get('password')
            phone = data.get('phone')

            if fname and lname and email and gender and phone and password:
                # Vérifier si l'e-mail existe déjà dans la base de données
                existing_user = Users.query.filter_by(email=email).first()

                if existing_user:
                    return jsonify({"error": "A user with this email already exists"}), 409

                # Hasher le mot de passe avant de le stocker dans la base de données
                hashed_password = hash_password(password)

                new_user = Users(
                    fname=fname,
                    lname=lname,
                    gender=gender,
                    email=email,
                    password=hashed_password,
                    phone=phone
                )
                db.session.add(new_user)
                db.session.commit()
                return jsonify({"message": "Utilisateur créé avec succès 🥳 "}), 201
            else:
                return jsonify({"error": "Certaines données manquent 🙁 "}), 206
        else:
            return jsonify({"error": "Le corps de la requête doit être en JSON ☠️ "}), 400

    except Exception as e:
        print(e)

# Delete user by id
@app.route('/api/user/<int:id>', methods=['DELETE'])
@swag_from('swagger/delete_user.yml')
def delete_user(id):
    try:
        user = Users.query.get(id)
        if user and request.method == 'DELETE':
            db.session.delete(user)
            db.session.commit()
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"error": "Something went wrong"}, 400)
    except Exception as e:
        print(e)

# Update user by given id
@app.route('/api/user/<int:id>', methods=['PUT'])
@swag_from('swagger/update_user.yml')
def update_user(id):
    try:
        user = Users.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}, 404)
        if user and request.is_json and request.method == 'PUT':
            data = request.get_json()
            if data:
                if 'first_name' in data:
                    user.fname = data['first_name']
                if 'last_name' in data:
                    user.lname = data['last_name']
                if 'gender' in data:
                    user.gender = data['gender']
                if 'email' in data:
                    user.email = data['email']
                if 'password' in data:
                    hashed_password = hash_password(data['password'])
                    user.password = hashed_password
                if 'phone' in data:
                    user.phone = data['phone']

                db.session.commit()
                return jsonify({"message": "User updated successfully 🥳 "}), 201
            else:
                return jsonify({"error": "Nothing to update"}, 400)
        else:
            return jsonify({"error": "Something went wrong ☠️ "}, 500)

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error ☠️ "}, 500)

# Update user by email
@app.route('/api/user/<string:email>', methods=['PUT'])
@swag_from('swagger/update_user_by_email.yml')
def update_user_by_email(email):
    try:
        user = Users.query.filter_by(email=email).first()
        if user is None:
            return jsonify({"error": "User not found"}, 404)
        if user and request.is_json and request.method == 'PUT':
            data = request.get_json()
            if data:
                if 'first_name' in data:
                    user.fname = data['first_name']
                if 'last_name' in data:
                    user.lname = data['last_name']
                if 'gender' in data:
                    user.gender = data['gender']
                if 'email' in data:
                    user.email = data['email']
                if 'password' in data:
                    hashed_password = hash_password(data['password'])
                    user.password = hashed_password
                if 'phone' in data:
                    user.phone = data['phone']

                db.session.commit()
                return jsonify({"message": "User updated successfully 🥳 "}), 201
            else:
                return jsonify({"error": "Nothing to update"}, 400)
        else:
            return jsonify({"error": "Something went wrong ☠️ "}, 500)

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error ☠️ "}, 500)

# Login a User
@app.route('/api/login', methods=['POST'])
@swag_from('swagger/login_user.yml')
def login_user():
    try:
        if request.is_json and request.method == 'POST':
            data = request.get_json()
            email = data.get('email')
            input_password = data.get('password')

            if email and input_password:
                # Query the database for a user with the provided email
                user = Users.query.filter_by(email=email).first()
                if user:
                    # Check if the provided password matches the stored password
                    if check_password(input_password, user.password):
                        access_token = create_access_token(identity=user.email, expires_delta=app.config['JWT_ACCESS_TOKEN_EXPIRES'])
                        refresh_token = create_refresh_token(identity=user.email, expires_delta=app.config['JWT_REFRESH_TOKEN_EXPIRES'])
                        print(user)
                        return (
                            jsonify(
                                {
                                    "message": "Logged In ",
                                    "tokens": {"access": access_token, "refresh": refresh_token},
                                    "user" : {"email":user.email, 'firstname': user.fname, "lastname": user.lname, "phone":user.phone,"gender":user.gender}
                                }
                            ),
                            200,
                        )
                    else:
                        return jsonify({"error": "Incorrect password"}, 401)
                else:
                    return jsonify({"error": "User not found"}, 404)
            else:
                return jsonify({"error": "Some data is missing 🙁 "}, 400)
        else:
            return jsonify({"error": "Request body must be JSON ☠️ "}, 400)

    except Exception as e:
        return jsonify({"error": "Something went wrong ☠️ "}, 500)
    
  
@app.route('/api/refresh_token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    try:
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user, expires_delta=app.config['JWT_ACCESS_TOKEN_EXPIRES'])
        refresh_token = create_refresh_token(identity=current_user, expires_delta=app.config['JWT_REFRESH_TOKEN_EXPIRES'])
        return (
                jsonify(
                    {
                        "message": "Logged In ",
                        "tokens": {"access": access_token, "refresh": refresh_token},
                    }
                ),
                200,
            )
    except Exception as e:
        return jsonify(message="Token expiré. Veuillez vous reconnecter."), 401

# # When we put acces
# @app.route('/api/get_path', methods=['POST'])
# @jwt_required(refresh=False)
# def get_path():
#     try:
#         limitations = {"max_elevation": 300}
#         map_instance = Map()

#         # Retrieve the list of tuples from the request JSON payload
#         data = request.json
#         print(data)
        
#         # Check if 'points' key exists and is a list
#         if not data or 'points' not in data or not isinstance(data['points'], list):
#             return jsonify({"error": "Invalid request data. Expecting a list of tuples with 'points' key."}), 400
        
#         # Convert the list of tuples to a hashable type (e.g., tuple of tuples)
#         points = tuple(map(tuple, data['points']))
#         print(points)

#         # Create the path using the received points
#         path = map_instance.create_path(points, limitations)

#         return jsonify(path), 200

#     except Exception as e:
#         return jsonify({"error": "Something went wrong ☠️ " + str(e)}, 500)


# Use to decode a password
def check_password(input_password, stored_hashed_password):
    try:
        # Use bcrypt's checkpw function to verify the input password against the stored hashed password
        return bcrypt.checkpw(input_password.encode('utf-8'), stored_hashed_password.encode('utf-8'))
    except Exception as e:
        print(e)
        return False

# Use to encode a password
def hash_password(password):
    try:
        # Use bcrypt to hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')
    except Exception as e:
        print(e)
        return None

