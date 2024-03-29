from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path


db = SQLAlchemy()
DB_NAME = "database.db"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    from .auth import auth
    from .views import views
    from .add_laptop import add_laptop_bp
    from .modify_laptop import modify_laptop_bp

    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(views,url_prefix='/')
    app.register_blueprint(add_laptop_bp,url_prefix='/admin_bookings/')
    app.register_blueprint(modify_laptop_bp, url_prefix='/admin_bookings/')


    from .models import Laptop,Booking
    
    with app.app_context():
        db.create_all()
        db.configure_mappers()

    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        db.create_all(app = app)
        print('Created Database!')

