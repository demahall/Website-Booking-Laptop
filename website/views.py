from flask import Blueprint,jsonify ,render_template, request, flash, redirect, url_for, session as flask_session
from website.models import Booking,Laptop
from website import db
from sqlalchemy.orm import Session as SQLAlchemySession
from sqlalchemy import or_

views = Blueprint('views',__name__)
session = SQLAlchemySession()


@views.route('/',methods=['GET'])
def booking_form_page():
    if flask_session.get('admin_logged_in'):
        return redirect(url_for('auth.admin_bookings'))

    laptops = available_laptops()
    return render_template("booking_form.html", available_laptops=laptops)


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

        for laptop_id in selected_laptops:
            laptop = Laptop.query.get(laptop_id)
            if laptop and not laptop.booking_id:
                laptop.booking_id = new_booking.id
                new_booking.laptops.append(laptop)

        db.session.commit()
        flash('Booking successful!', 'success')

    return redirect(url_for('views.booking_form_page'))

@views.route('/')
def index():
    flashed_messages_exist = check_if_flashed_messages_exist()  # Implement this function to check if flashed messages exist
    return render_template('base.html', flashed_messages_exist=flashed_messages_exist)





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

    # Retrieve laptops associated with bookings that have a status of 'returned' or 'pending'
    booked_laptops = Laptop.query.join(Booking.laptops).filter(
        or_(Booking.status == 'returned', Booking.status == 'pending')).all()

    # Combine the available laptops and the booked laptops
    laptops = laptops + booked_laptops

    # Custom sorting function to sort by numeric order in laptop names


    # Sort the laptops using the custom sorting function
    laptops.sort(key=sort_laptop_name)

    return laptops

def sort_laptop_name(laptop):
    parts = laptop.name.split()  # Split the name by spaces
    numeric_part = int(parts[-1]) if parts[-1].isdigit() else float('inf')  # Extract the numeric part
    return (parts[0], numeric_part)  # Tuple for sorting







