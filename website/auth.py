from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from werkzeug.security import check_password_hash, generate_password_hash
from website.models import Booking, Laptop
from website import db



auth = Blueprint('auth', __name__)

# Hardcoded admin credentials (replace with a more secure solution)
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD_HASH = generate_password_hash('admin_password')

@auth.route('/admin_login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD_HASH, password):
            session['admin_logged_in'] = True
            flash('Admin login successful!', 'success')
            return redirect(url_for('auth.admin_bookings'))

        flash('Invalid username or password', 'error')

    return render_template('admin_login.html')

@auth.route('/admin_logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    flash('Admin logout successful!', 'success')
    return redirect(url_for('views.book_laptops'))

@auth.route('/admin_bookings',methods =['GET'])
def admin_bookings():

    if not session.get('admin_logged_in'):
        flash('Unauthorized access. Please login as admin.', 'error')
        return redirect(url_for('views.show_laptop_information'))


    bookings = Booking.query.all()
    return render_template('admin_bookings.html', bookings=bookings)

@auth.route('/admin_bookings/<int:booking_id>', methods=['POST'])
def update_booking_status(booking_id):
    # Get the new status from the form data
    new_status = request.form['status']

    # Find the booking by its ID
    booking = Booking.query.get(booking_id)

    if not booking:
        # Handle the case where the booking ID is not found
        flash('Booking not found.', 'error')
        return redirect(url_for('auth.admin_bookings'))

    # Update the status of the booking
    booking.status = new_status

    db.session.commit()

    # Redirect back to the admin bookings page
    return redirect(url_for('auth.admin_bookings'))

@auth.route('/delete_booking/<int:booking_id>', methods=['POST'])
def delete_booking(booking_id):
    # Retrieve the booking object
    booking = Booking.query.get_or_404(booking_id)

    # Delete the booking
    db.session.delete(booking)
    db.session.commit()

    flash('Booking deleted successfully', 'success')

    return redirect(url_for('auth.admin_bookings'))