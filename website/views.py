from flask import Blueprint,jsonify ,render_template, request, flash, redirect, url_for, session as flask_session
from website.models import Booking,Laptop,Log
from website import db
from website.utils import generate_log_message
from sqlalchemy.orm import Session as SQLAlchemySession
from sqlalchemy import inspect

views = Blueprint('views',__name__)
session = SQLAlchemySession()




@views.route('/',methods=['GET'])
def booking_form_page():
    managing_page = request.args.get('managing_page', 'false')
    flask_session['managing_page'] = (managing_page == 'true')
    laptops = available_laptops()
    return render_template("booking_form.html", available_laptops=laptops)

@views.route('/bookings_overview',methods=['GET'])
def bookings_overview_page():
    flask_session['managing_page'] = True
    bookings = Booking.query.all()
    return render_template('admin_bookings.html',bookings=bookings)

@views.route('/logs')
def logs_page():
    logs = Log.query.order_by(Log.timestamp.desc()).all()
    return render_template('logs.html', logs=logs)

@views.route('/back_to_booking_form')
def back_to_booking_form():
    flask_session['managing_page'] = False
    return redirect(url_for('views.booking_form_page'))

@views.route('/filter', methods=['GET', 'POST'])
def show_laptop_information():
    laptops = available_laptops()
    filtered_laptops = []
    if request.method == 'POST':
        criteria = request.form.get('criteria')
        query = request.form.get('query')
        if query and criteria:
            if criteria == 'name':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.name.lower()]
            if criteria == 'hersteller':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.hersteller.lower()]
            elif criteria == 'dongle_id':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.dongle_id.lower()]
            elif criteria == 'mac_addresse':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.mac_addresse.lower()]
            elif criteria == 'lynx_version':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.lynx_version.lower()]
            elif criteria == 'puma_und_concerto_version':
                filtered_laptops = [laptop.serialize() for laptop in laptops
                                    if query.lower() in laptop.puma_und_concerto_version.lower()]
            elif criteria == 'creta_version':
                filtered_laptops = [laptop.serialize() for laptop in laptops if query.lower() in laptop.creta_version.lower()]

            return jsonify(filtered_laptops)
        else:
            return jsonify([laptop.serialize() for laptop in laptops])
    else:
        # Handle GET request
        return jsonify([laptop.serialize() for laptop in laptops])


@views.route('/suggestions', methods=['POST'])
def get_suggestions():
    laptops = available_laptops()
    criteria = request.form.get('criteria')
    partial_query = request.form.get('partial_query')

    if criteria in Laptop.__table__.columns:
        columns = [getattr(laptop,criteria) for laptop in laptops]
        suggestions = [suggestion for suggestion in columns if partial_query.lower() in suggestion.lower()]
        suggestions = list(set(suggestions))
        return jsonify(suggestions)
    else:
        return jsonify([])


@views.route('/laptop_information', methods=['GET'])
def laptop_information_page():
    return render_template('laptop_details.html')

@views.route('/show_laptop', methods=['GET', 'POST'])
def show_laptop():

    laptops = Laptop.query.all()
    laptops.sort(key=sort_laptop_name)

    if request.method == 'POST':
        # Get the selected criteria from the form
        selected_criteria = request.json.get('criteria')
        filtered_laptops = filter_laptops(selected_criteria, laptops)

        return jsonify(filtered_laptops)

@views.route('/', methods=['POST'])
def book_laptops():

    confirm_submit = request.form.get('confirm_submit')

    if confirm_submit == 'yes':
        name = request.form.get('name')
        selected_dates = request.form.get('dates')
        selected_laptops = request.form.getlist('selected_laptops')
        comment = request.form.get('comment')

        if not name or not selected_dates or not selected_laptops:
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('views.booking_form_page'))

        new_booking = Booking(name=name, selected_dates=selected_dates,comment=comment)
        db.session.add(new_booking)
        db.session.flush()

        selected_laptops = Laptop.query.filter(Laptop.id.in_(selected_laptops)).all()

        laptop_details = []

        for laptop in selected_laptops:
            laptop.booking_id = new_booking.id
            new_booking.laptops.append(laptop)
            laptop_details.append(f"Laptop ID: {laptop.id}, Laptop Name: {laptop.name}")

        db.session.commit()

        generate_log_message(action='booking laptops',name=name,selected_dates=selected_dates,laptops=selected_laptops,comment=comment)

        flash('Booking successful!', 'success')

    return redirect(url_for('views.booking_form_page'))

def filter_laptops(selected_criteria,laptops):
    # Initialize a dictionary to store the filtered criteria for each laptop
    filtered_laptops = {}

    laptop_bookings={}
    for laptop in laptops:
        bookings=laptop.bookings
        booking = next((b for b in bookings if b.status == "booked"), None)
        if booking:
            laptop_bookings[laptop.name] = f'{booking.name} from {booking.selected_dates}'
        else:
            laptop_bookings[laptop.name] = 'Available'

    # Populate the filtered laptops dictionary with laptop names, borrowers, and selected dates

    filtered_laptops["Laptop Name"] = [laptop.name for laptop in laptops]
    filtered_laptops["Booked by"] = [laptop_bookings[laptop.name] for laptop in laptops]

    for criterion in selected_criteria:
        if hasattr(Laptop, criterion):
            filtered_laptops[f'{criterion}'] = [getattr(laptop,criterion) for laptop in laptops]

    return filtered_laptops

def available_laptops():
    # Retrieve laptops that are not currently booked
    laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

    booked_laptops = Laptop.query.filter(Laptop.booking_id.isnot(None)).all()

    filtered_booked_laptops = []
    for laptop in booked_laptops:
        if db.session.query(Booking).get(laptop.booking_id).status != 'booked':
            filtered_booked_laptops.append(laptop)

    # Combine laptops and booked_laptops (using a set for efficient duplicate removal)
    laptops = set(laptops + filtered_booked_laptops)

    # Convert back to a list for potential sorting needs
    laptops = list(laptops)

    # Sort the laptops using the custom sorting function
    laptops.sort(key=sort_laptop_name)

    return laptops

def sort_laptop_name(laptop):
    parts = laptop.name.split()  # Split the name by spaces
    numeric_part = int(parts[-1]) if parts[-1].isdigit() else float('inf')  # Extract the numeric part
    return (parts[0], numeric_part)  # Tuple for sorting







