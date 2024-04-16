import json
from website import db,create_app
from website.models import Laptop
import os


curr_dir = os.getcwd()

def insert_laptops_from_json(file_path=curr_dir+'/static/laptop_information.json'):

    app = create_app()
    app.app_context().push()
    with open(file_path, 'r') as json_file:
        laptops_data = json.load(json_file)

    for laptop_info in laptops_data:
        new_laptop = Laptop(**laptop_info)
        db.session.add(new_laptop)

    db.session.commit()

def run_migrations(message):
    app = create_app()
    with app.app_context():
        os.system(f'flask db migrate -m "{message}"')
        os.system('flask db upgrade')


# Call the function to insert laptops
if __name__ == "__main__":
    #insert_laptops_from_json()
    run_migrations("Add comment column to Booking table")