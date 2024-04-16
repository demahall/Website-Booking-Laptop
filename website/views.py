from flask import Blueprint,jsonify ,render_template, request, flash, redirect, url_for
from website.models import Booking,Laptop
from website import db
from sqlalchemy.orm import Session
from sqlalchemy import or_

views = Blueprint('views',__name__)
session = Session()


@views.route('/',methods=['GET'])
def booking_form_page():
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


@views.route('/laptop_information', methods=['GET', 'POST'])
def show_laptop():

    selected_criteria = []
    if request.method == 'POST':
        # Get the selected criteria from the form
        selected_criteria = request.form.getlist('criteria')
        filtered_laptops = filter_laptops(selected_criteria)

    else:
        # If no criteria selected, display all laptops
        filtered_laptops = {laptop.name: {} for laptop in Laptop.query.all()}


    return render_template('laptop_details.html', filtered_laptops=filtered_laptops, selected_criteria=selected_criteria)


@views.route('/laptop_information/<int:laptop_id>')
def hover_information(laptop_id):
    laptop = Laptop.query.get_or_404(laptop_id)

    # Check if the laptop is booked and get booking information
    booking = laptop.booking
    borrower_name = ""
    borrowing_duration = ""
    if booking:
        borrower_name = booking.name
        borrowing_duration = f"{booking.selected_dates}"

    return render_template('laptop_details.html', laptop=laptop, borrower_name=borrower_name,
                           borrowing_duration=borrowing_duration)


@views.route('/', methods=['POST'])
def book_laptops():
    name = request.form.get('name')
    selected_dates = request.form.get('dates')
    selected_laptops = request.form.getlist('selected_laptops')
    comment = request.form('comment')

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

def filter_laptops(selected_criteria):
    # Initialize a dictionary to store the filtered criteria for each laptop
    filtered_laptops = {}

    # Iterate over each laptop in the database
    for laptop in Laptop.query.all():
        # Initialize a list to store the filtered criteria for the current laptop
        laptop_criteria = []

        # Iterate over each selected criterion
        for criterion in selected_criteria:
            # Check if the criterion exists as an attribute of the laptop
            if hasattr(laptop, criterion):
                # Get the value of the criterion for the current laptop
                criterion_value = getattr(laptop, criterion)
                # Add the criterion and its value to the list of filtered criteria
                laptop_criteria.append(f"{criterion_value}")

        # Store the filtered criteria for the current laptop
        filtered_laptops[laptop.name] = laptop_criteria

    return filtered_laptops


def available_laptops():
    # Retrieve laptops that are not currently booked
    laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

    # Retrieve laptops associated with bookings that have a status of 'returned' or 'pending'
    booked_laptops = Laptop.query.join(Booking.laptops).filter(
        or_(Booking.status == 'returned', Booking.status == 'pending')).all()

    # Combine the available laptops and the booked laptops
    laptops = laptops + booked_laptops

    laptops.sort(key=lambda laptop: laptop.name, reverse=False)

    return laptops









