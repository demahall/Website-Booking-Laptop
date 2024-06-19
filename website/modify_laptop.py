from flask import Blueprint, render_template,session, request,redirect,url_for,flash,jsonify
from website.models import Laptop
from website import db
from website.utils import generate_log_message


modify_laptop_bp = Blueprint('modify_laptop', __name__)
@modify_laptop_bp.route('/modify_laptop',methods = ['GET'])
def modify_laptop_page():
    session['managing_page'] = True
    laptops = Laptop.query.all()
    laptops.sort(key=lambda  laptop:laptop.name, reverse=False)
    return render_template('laptop_edit.html',laptops=laptops)


@modify_laptop_bp.route('/update_laptop_info/<int:laptop_id>', methods=['GET', 'POST'])
def update_laptop_info(laptop_id):
    laptop = Laptop.query.get_or_404(laptop_id)

    confirm_update_laptop = request.form.get('confirm_update')

    if confirm_update_laptop == 'yes':
        # Store original values
        original_values = {
            'name': laptop.name,
            'hersteller': laptop.hersteller,
            'service_tag': laptop.service_tag,
            'user_password': laptop.user_password,
            'dongle_id': laptop.dongle_id,
            'vol_c_id': laptop.vol_c_id,
            'mac_addresse': laptop.mac_addresse,
            'puma_und_concerto_version': laptop.puma_und_concerto_version,
            'puma_und_concerto_lizenz_datum': laptop.puma_und_concerto_lizenz_datum,
            'lynx_version': laptop.lynx_version,
            'lynx_lizenz_datum': laptop.lynx_lizenz_datum,
            'cameo_version': laptop.cameo_version,
            'cameo_lizenz_datum': laptop.cameo_lizenz_datum,
            'creta_version': laptop.creta_version,
            'creta_lizenz_datum': laptop.creta_lizenz_datum,
            'gewaehrleistung': laptop.gewaehrleistung
        }

        # Get new values from the form
        new_values = {
            'name': request.form['name'],
            'hersteller': request.form['hersteller'],
            'service_tag': request.form['service_tag'],
            'user_password': request.form['user_password'],
            'dongle_id': request.form['dongle_id'],
            'vol_c_id': request.form['vol_c_id'],
            'mac_addresse': request.form['mac_addresse'],
            'puma_und_concerto_version': request.form['puma_und_concerto_version'],
            'puma_und_concerto_lizenz_datum': request.form['puma_und_concerto_lizenz_datum'],
            'lynx_version': request.form['lynx_version'],
            'lynx_lizenz_datum': request.form['lynx_lizenz_datum'],
            'cameo_version': request.form['cameo_version'],
            'cameo_lizenz_datum': request.form['cameo_lizenz_datum'],
            'creta_version': request.form['creta_version'],
            'creta_lizenz_datum': request.form['creta_lizenz_datum'],
            'gewaehrleistung': request.form['gewaehrleistung']
        }

        # Update laptop with new values
        for key, value in new_values.items():
            setattr(laptop, key, value)

        db.session.commit()

        # Compare original and new values to identify changes
        changes = {}
        for key, original_value in original_values.items():
            new_value = new_values[key]
            if original_value != new_value:
                changes[key] = {'old': original_value, 'new': new_value}

        # Generate log message if there are changes and put the name who change the laptop
        user_name = request.form.get('user_name')
        if changes:
            generate_log_message(action='updated laptop',user_name=user_name,
                                 laptop_name=laptop.name,
                                 changes=changes)

        flash_message = 'Update Laptop successfully'
        flash(flash_message, 'success')

        return redirect(url_for('modify_laptop.modify_laptop_page', laptop_id=laptop_id))

    return render_template('laptop_edit.html', laptop=laptop)


@modify_laptop_bp.route('/delete_laptop/<int:laptop_id>', methods=['POST'])
def delete_laptop(laptop_id):

    #get confirmation from javascript
    confirm_delete_laptop = request.form.get('confirm_delete')

    if confirm_delete_laptop == 'yes':

        # get laptop
        laptop = Laptop.query.get_or_404(laptop_id)

        db.session.delete(laptop)
        db.session.commit()

        user_name = request.form.get('user_name')
        generate_log_message(action='delete Laptop',user_name=user_name, laptop_name=laptop.name)
        flash_message = 'Laptop deleted successfully'
        flash(flash_message, 'success')

    return redirect(url_for('modify_laptop.modify_laptop_page'))



