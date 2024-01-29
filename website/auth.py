from flask import Blueprint, render_template, request, flash, redirect, url_for
from website.models import Booking,Laptop
from datetime import datetime
from website import db   ##means from __init__.py import db



auth = Blueprint('auth', __name__)

@auth.route('/laptop_information', methods=['GET'])
def show_laptop_information():
    available_laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()
    return render_template("laptop.html", available_laptops=available_laptops)

@auth.route('/book_laptops', methods=['POST'])
def book_laptops():
    name = request.form.get('name')
    email = request.form.get('email')
    startDate = request.form.get('startDate')
    endDate = request.form.get('endDate')
    selected_laptops = request.form.getlist('selected_laptops')

    result = check_date(startDate, endDate)

    if result is not None:
        start_date, end_date = result

        new_booking = Booking(name=name, email=email, startDate=start_date, endDate=end_date)

        for laptop_id in selected_laptops:
            laptop = Laptop.query.filter_by(id=laptop_id, booking_id=None).first()
            if laptop:
                new_booking.laptops.append(laptop)
                laptop.booking = new_booking  # Mark the laptop as booked

        db.session.add(new_booking)
        db.session.commit()
        flash('Booking successful!', 'success')
    else:
        flash('Invalid date format or start date must be earlier than end date', 'error')

    return redirect(url_for('auth.show_laptop_information'))

def check_date(start_date, end_date):
    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

        if start_date > end_date:
            return start_date, end_date  # Valid dates
        else:
            return None  # Invalid dates
    except ValueError:
        return None  # Invalid date format






