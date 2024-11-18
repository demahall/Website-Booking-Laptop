import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from os import path



db = SQLAlchemy()
migrate = Migrate()
DB_NAME = "database.db"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['SESSION_TYPE'] = 'filesystem'

    Session(app)
    db.init_app(app)
    migrate.init_app(app,db)


    from website.api.manage_bookings import manage_bookings_bp
    from website.views import views_bp
    from website.api.add_laptop import add_laptop_bp
    from website.api.modify_laptop import modify_laptop_bp
    from website.api.calendar_overview import calendar_overview_bp
    from website.api.laptop_api import laptop_api_bp
    from website.api.book_laptops import book_laptops_api

    app.register_blueprint(manage_bookings_bp, url_prefix='/')
    app.register_blueprint(views_bp,url_prefix='/')
    app.register_blueprint(laptop_api_bp,url_prefix='/api')
    app.register_blueprint(book_laptops_api,url_prefix='/')
    app.register_blueprint(add_laptop_bp,url_prefix='/bookings_overview/')
    app.register_blueprint(modify_laptop_bp, url_prefix='/bookings_overview/')
    app.register_blueprint(calendar_overview_bp, url_prefix='/')


    from website.models import Laptop,Booking,Log
    
    with app.app_context():
        db.create_all()
        db.configure_mappers()

    return app

def create_database(app):
    if not path.exists(DB_NAME):
        db.create_all(app = app)
        print('Created Database!')

def run_migrations(message):
    app = create_app()
    with app.app_context():
        os.system(f'flask db migrate -m "{message}"')
        os.system('flask db upgrade')

