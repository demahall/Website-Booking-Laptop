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



    from website.auth import auth
    from website.views import views
    from website.add_laptop import add_laptop_bp
    from website.modify_laptop import modify_laptop_bp

    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(views,url_prefix='/')
    app.register_blueprint(add_laptop_bp,url_prefix='/bookings_overview/')
    app.register_blueprint(modify_laptop_bp, url_prefix='/bookings_overview/')


    from website.models import Laptop,Booking,Log
    
    with app.app_context():
        db.create_all()
        db.configure_mappers()

    return app

def create_database(app):
    if not path.exists('website/' + DB_NAME):
        db.create_all(app = app)
        print('Created Database!')

def run_migrations(message):
    app = create_app()
    with app.app_context():
        os.system(f'flask db migrate -m "{message}"')
        os.system('flask db upgrade')

