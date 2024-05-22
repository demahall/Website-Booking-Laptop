from flask import Blueprint, render_template, request, flash, redirect, url_for
from website.utils import generate_log_message
from website.models import Booking
from website import db



auth = Blueprint('auth', __name__)


@auth.route('/admin_bookings/<int:booking_id>', methods=['POST'])
def update_booking_status(booking_id):



    # Get the new status from the form data
    new_status = request.form['status']

    # Find the booking by its ID
    booking = Booking.query.get(booking_id)
    current_status = booking.status

    if not booking:
        # Handle the case where the booking ID is not found
        flash('Booking not found.', 'error')
        return redirect(url_for('views.bookings_overview_page'))

    # Update the status of the booking
    booking.status = new_status

    db.session.commit()

    generate_log_message(action='change status booking',booking_id=booking_id, current_status=current_status,new_status=new_status)

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
        generate_log_message(action='delete booking',booking_id=booking_id)
        flash('Booking deleted successfully', 'success')

    return redirect(url_for('views.bookings_overview_page'))