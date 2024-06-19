from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from website.models import Laptop
from website import db
from website.utils import generate_log_message

#add_laptop als URL for html
add_laptop_bp = Blueprint('add_laptop', __name__)
@add_laptop_bp.route('/add_laptop',methods = ['GET'])
def add_laptop_page():
    session['managing_page'] = True
    return render_template('add_laptop.html')

@add_laptop_bp.route('/add_new_laptop',methods = ['GET','POST'])
def add_laptop():

    session['managing_page'] = True
    confirm_add_laptop = request.form.get('confirm_adding_laptop')

    if confirm_add_laptop == 'yes':
        name = request.form['name']
        hersteller = request.form['hersteller']
        service_tag = request.form['service_tag']
        user_password = request.form['user_password']
        dongle_id = request.form['dongle_id']
        vol_c_id = request.form['vol_c_id']
        mac_addresse = request.form['mac_addresse']
        puma_und_concerto_version = request.form['puma_und_concerto_version']
        puma_und_concerto_lizenz_datum = request.form['puma_und_concerto_lizenz_datum']
        lynx_version = request.form['lynx_version']
        lynx_lizenz_datum = request.form['lynx_lizenz_datum']
        cameo_version = request.form['cameo_version']
        cameo_lizenz_datum = request.form['cameo_lizenz_datum']
        creta_version = request.form['creta_version']
        creta_lizenz_datum = request.form['creta_lizenz_datum']
        gewaehrleistung = request.form['gewaehrleistung']

        new_laptop = Laptop(name=name,
                            hersteller=hersteller,
                            service_tag=service_tag,
                            user_password=user_password,
                            dongle_id=dongle_id,
                            vol_c_id=vol_c_id,
                            mac_addresse=mac_addresse,
                            puma_und_concerto_version=puma_und_concerto_version,
                            puma_und_concerto_lizenz_datum=puma_und_concerto_lizenz_datum,
                            lynx_version=lynx_version,
                            lynx_lizenz_datum=lynx_lizenz_datum,
                            cameo_version=cameo_version,
                            cameo_lizenz_datum=cameo_lizenz_datum,
                            creta_version=creta_version,
                            creta_lizenz_datum=creta_lizenz_datum,
                            gewaehrleistung=gewaehrleistung
                            )
        db.session.add(new_laptop)
        db.session.commit()

        user_name = request.form.get('user_name')
        flash('New laptop added successfully!', 'success')
        generate_log_message(action='add laptop',user_name=user_name, name=name)

    return redirect(url_for('add_laptop.add_laptop_page'))