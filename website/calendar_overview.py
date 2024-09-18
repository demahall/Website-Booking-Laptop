from flask import Blueprint, render_template, request, jsonify
from website.models import Booking

calendar_overview_bp = Blueprint('calendar_overview', __name__)

@calendar_overview_bp.route('/calendar_overview')
def calendar_overview():
    return render_template('calendar_overview.html')

@calendar_overview_bp.route('/get_bookings', methods=['GET', 'POST'])
def get_bookings():
    booking_list = []

    if request.method == 'POST':
        # Get the status from the JSON request
        status = request.json.get('status')

        if not status or status.lower() == 'all':
            # If status is None, empty, or 'all', fetch all bookings
            bookings = Booking.query.all()
        else:
            # Filter bookings by the provided status
            bookings = Booking.query.filter(Booking.status == status.lower()).all()

        for booking in bookings:
            start_dates, end_dates, one_day = parse_date(booking.selected_dates)

            booking_data = {
                'id' : booking.id,
                'name': booking.name,
                'status': booking.status,
                'startDate': start_dates,
                'endDate': end_dates,
                'oneDay': one_day,
                'date' : booking.date,
                'laptops' : [laptop.name for laptop in booking.laptops],
                #Handle Null values by old booking without customer and location information (Temporary)
                'customer' : booking.customer if booking.customer else '-',
                'location' : booking.location if booking.location else '-',
                'comment' : booking.comment
            }

            booking_list.append(booking_data)

        return jsonify(booking_list)

    return jsonify({'error': 'Invalid request method'}), 400


def parse_date(dates):

    dates = dates.split(' to ')
    if len(dates)==1: #If booked dates only one day
        date = dates[0].split('.')
        date = list(map(int,date))
        start_date = end_date = date
        one_day = True

    else:
        start_date = dates[0].split('.')
        start_date = list(map(int,start_date))
        end_date =  dates[1].split('.')
        end_date = list(map(int,end_date))
        one_day = False

    return start_date,end_date,one_day


