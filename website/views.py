from flask import Blueprint,jsonify ,render_template, request, flash, redirect, url_for
from website.models import Booking,Laptop
from website import db
from sqlalchemy.orm import Session
from sqlalchemy import or_

views = Blueprint('views',__name__)
session = Session()


@views.route('/',methods=['GET'])
def booking_form_page():
    # Retrieve laptops that are not currently booked
    laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

    # Retrieve laptops associated with bookings that have a status of 'returned' or 'pending'
    booked_laptops = Laptop.query.join(Booking.laptops).filter(
        or_(Booking.status == 'returned', Booking.status == 'pending')).all()

    flash(f'{booked_laptops}')

    # Combine the available laptops and the booked laptops
    laptops = laptops + booked_laptops

    return render_template("laptop.html", available_laptops=laptops)

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

@views.route('/', methods=['POST'])
def book_laptops():
    name = request.form.get('name')
    selected_dates = request.form.get('dates')
    selected_laptops = request.form.getlist('selected_laptops')

    if not name or not selected_dates or not selected_laptops:
        flash('Please fill in all required fields.', 'error')
        return redirect(url_for('views.booking_form_page'))

    new_booking = Booking(name=name, selected_dates=selected_dates)
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












