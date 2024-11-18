from flask import Blueprint, request,flash,redirect,url_for
from website.api.log_message import generate_log_message
from website import db
from website.models import Booking,Laptop


book_laptops_api =Blueprint('book_laptops',__name__)

@book_laptops_api.route('/', methods=['POST'])
def book_laptops():

    confirm_submit = request.form.get('confirm_submit')

    if confirm_submit == 'yes':
        name = request.form.get('name')
        selected_dates = request.form.get('dates')
        selected_laptops = request.form.getlist('selected_laptops')
        customer = request.form.get('customer')
        location = request.form.get('location')
        comment = request.form.get('comment')

        if not name or not selected_dates or not selected_laptops:
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('views.booking_form_page'))

        new_booking = Booking(name=name, selected_dates=selected_dates,customer=customer,location=location
                              ,comment=comment)
        db.session.add(new_booking)
        db.session.flush()

        selected_laptops = Laptop.query.filter(Laptop.id.in_(selected_laptops)).all()

        laptop_details = []

        for laptop in selected_laptops:
            laptop.booking_id = new_booking.id
            new_booking.laptops.append(laptop)
            laptop_details.append(f"Laptop ID: {laptop.id}, Laptop Name: {laptop.name}")

        db.session.commit()

        generate_log_message(action='booking laptops',
                             name=name,
                             selected_dates=selected_dates,
                             laptops=selected_laptops,
                             customer =customer,
                             location=location,
                             comment=comment)

        flash('Booking successful!', 'success')

    return redirect(url_for('views.booking_form_page'))







