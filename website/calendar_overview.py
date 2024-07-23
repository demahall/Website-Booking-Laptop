from flask import Blueprint, render_template, request, flash, redirect, url_for, session, jsonify
from website.models import Booking
from website import db
from website.utils import generate_log_message

calendar_overview_bp = Blueprint('calendar_overview', __name__)

@calendar_overview_bp.route('/calendar_overview')
def calendar_overview():
    session['managing_page'] = True
    return render_template('calendar_overview.html')
@calendar_overview_bp.route('/get_bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    booking_list = []
    for booking in bookings:
        booking_data = {
            'id': booking.id,
            'name': booking.name,
            'status': booking.status,
            'selected_dates': booking.selected_dates,
            'comment': booking.comment
            #another criteria will be needed for hover information
        }

        booking_list.append(booking_data)
    return jsonify(booking_list)
