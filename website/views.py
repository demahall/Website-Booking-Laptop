from flask import Blueprint,render_template, request, redirect, url_for, session as flask_session
from website.models import Log,Booking
from sqlalchemy.orm import Session as SQLAlchemySession
from website.utils.laptop_utils import *

views_bp = Blueprint('views',__name__)
session = SQLAlchemySession()

@views_bp.route('/',methods=['GET'])
def booking_form_page():
    managing_page = request.args.get('managing_page', 'false')
    flask_session['managing_page'] = (managing_page == 'true')
    available_laptops = get_available_laptops()
    return render_template("bookings/booking_form.html", available_laptops=available_laptops)

@views_bp.route('/bookings_overview',methods=['GET'])
def bookings_overview_page():
    flask_session['managing_page'] = True
    bookings = Booking.query.all()
    return render_template('bookings/manage_bookings.html',bookings=bookings)

@views_bp.route('/laptop_information', methods=['GET'])
def laptop_information_page():
    return render_template('laptops/laptop_information.html')

@views_bp.route('/logs')
def logs_page():
    logs = Log.query.order_by(Log.timestamp.desc()).all()
    return render_template('common/logs.html', logs=logs)

@views_bp.route('/back_to_booking_form')
def back_to_booking_form():
    flask_session['managing_page'] = False
    return redirect(url_for('views.booking_form_page'))

@views_bp.route('bookings_overview/add_laptop',methods = ['GET'])
def add_laptop_page():
    flask_session['managing_page'] = True
    return render_template('laptops/laptop_add.html')

@views_bp.route('/calendar_overview')
def calendar_overview_page():
    return render_template('calendar_overview.html')

@views_bp.route('bookings_overview/modify_laptop',methods = ['GET'])
def modify_laptop_page():
    flask_session['managing_page'] = True
    laptops = Laptop.query.all()
    laptops.sort(key=lambda  laptop:laptop.name, reverse=False)
    return render_template('laptops/laptop_edit.html',laptops=laptops)








