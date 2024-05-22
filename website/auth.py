from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from werkzeug.security import check_password_hash, generate_password_hash
from website.models import Booking, Laptop
from website import db



auth = Blueprint('auth', __name__)


@auth.route('/admin_bookings/<int:booking_id>', methods=['POST'])
def update_booking_status(booking_id):
    # Get the new status from the form data
    new_status = request.form['status']

    # Find the booking by its ID
    booking = Booking.query.get(booking_id)

    if not booking:
        # Handle the case where the booking ID is not found
        flash('Booking not found.', 'error')
        return redirect(url_for('views.bookings_overview_page'))

    # Update the status of the booking
    booking.status = new_status

    db.session.commit()

    # Redirect back to the admin bookings page
    return redirect(url_for('views.bookings_overview_page'))

@auth.route('/delete_booking/<int:booking_id>', methods=['POST'])
def delete_booking(booking_id):
    # Retrieve the booking object
    confirm_delete_booking = request.form.get('confirm_delete')
    if confirm_delete_booking == 'yes':
        booking = Booking.query.get_or_404(booking_id)

        for laptop in booking.laptops:
            laptop.booking_id = None

        # Delete the booking
        db.session.delete(booking)

        db.session.commit()

        flash('Booking deleted successfully', 'success')

    return redirect(url_for('views.bookings_overview_page'))