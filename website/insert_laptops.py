import json
from website import db,create_app
from website.models import Laptop
import os
from flask import Flask

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

# Call the function to insert laptops
if __name__ == "__main__":
    insert_laptops_from_json()