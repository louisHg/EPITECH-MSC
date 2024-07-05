from controller import db

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50))
    lname = db.Column(db.String(50))
    gender = db.Column(db.String(10))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    phone = db.Column(db.String(100))
    
    def __init__(self, fname, lname, gender, email, phone, password):
        self.fname = fname
        self.lname = lname
        self.gender = gender
        self.email = email
        self.password = password
        self.phone = phone
