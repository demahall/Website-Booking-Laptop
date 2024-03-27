from flask import Blueprint,jsonify ,render_template, request, flash, redirect, url_for
from website.models import Booking,Laptop
from website import db
from sqlalchemy.orm import Session

views = Blueprint('views',__name__)
session = Session()

@views.route('/', methods=['GET','POST'])
def show_laptop_information():

    if request.method == 'POST':
        criteria = request.form.get('criteria')
        query = request.form.get('query')

        laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

        if query and criteria:
            if criteria == 'hersteller':
                laptops = [laptop for laptop in laptops if query.lower() in laptop.hersteller.lower()]
            elif criteria == 'mac_addresse':
                laptops = [laptop for laptop in laptops if query.lower() in laptop.mac_addresse.lower()]

            return render_template("laptop.html",available_laptops=laptops)
        else:
            return render_template("laptop.html",available_laptops=None)

    else:
        # Handle GET request
        laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()
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

    '''if selected_laptops:
        # Create a new booking instance
        new_booking = Booking(name=name, selected_dates=selected_dates)
        db.session.add(new_booking)
        db.session.commit()

        for laptop_id in selected_laptops:
            laptop = Laptop.query.get(laptop_id)
            if laptop and not laptop.booking_id:
                laptop.booking_id = new_booking.id
                new_booking.laptops.append(laptop)
                db.session.commit()


        flash('Booking successful!', 'success')

    else:
        flash('Please select at least one laptop.', 'error')
    '''

    return redirect(url_for('views.show_laptop_information'))

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












