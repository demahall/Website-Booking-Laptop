from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from website.models import Laptop
from website import db
from website.utils import generate_log_message

calendar_overview_bp = Blueprint('calendar_overview', __name__)

@calendar_overview_bp.route('/calendar_overview')
def calendar_overview():
    session['managing_page'] = True
    return render_template('calendar_overview.html')