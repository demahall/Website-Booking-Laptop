from flask import Blueprint, request, jsonify
from website.utils.laptop_utils import *

laptop_api_bp = Blueprint('laptop_api',__name__)

def load_laptops():
    return Laptop.query.all()

@laptop_api_bp.route('/filter', methods=['GET', 'POST'])
def show_laptop_information():
    available_laptops = get_available_laptops()
    if request.method == 'POST':
        criteria = request.form.get('criteria')
        query = request.form.get('query')
        filtered_laptops = search_laptops(query,criteria)
        return jsonify(filtered_laptops)
    else:
        # Handle GET request
        return jsonify([laptop.serialize() for laptop in available_laptops])

@laptop_api_bp.route('/suggestions', methods=['POST'])
def get_suggestions():

    available_laptops = get_available_laptops()
    criteria = request.form.get('criteria')
    partial_query = request.form.get('partial_query')

    if criteria in Laptop.__table__.columns:
        columns = [getattr(laptop,criteria) for laptop in available_laptops]
        suggestions = [suggestion for suggestion in columns if suggestion and partial_query.lower() in suggestion.lower()]
        suggestions = list(set(suggestions))
        return jsonify(suggestions)
    else:
        return jsonify([])

@laptop_api_bp.route('/show_laptop', methods=['GET', 'POST'])
def show_laptop():

    laptops = load_laptops()
    laptops.sort(key=sort_laptop_name)

    if request.method == 'POST':
        # Get the selected criteria from the form
        selected_criteria = request.json.get('criteria')
        filtered_laptops = filter_laptops(selected_criteria, laptops)

        return jsonify(filtered_laptops)


