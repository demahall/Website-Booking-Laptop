from flask import Blueprint, render_template, request,redirect,url_for,flash
from website.models import Laptop
from website import db


modify_laptop_bp = Blueprint('modify_laptop', __name__)
@modify_laptop_bp.route('/modify_laptop',methods = ['GET'])
def modify_laptop_page():
    laptops = Laptop.query.all()
    laptops.sort(key=lambda  laptop:laptop.name, reverse=False)
    return render_template('laptop_edit.html',laptops=laptops)

@modify_laptop_bp.route('/update_laptop_info/<int:laptop_id>', methods=['GET','POST'])
def update_laptop_info(laptop_id):
    laptop = Laptop.query.get_or_404(laptop_id)

    if request.method == 'POST':
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

        laptop.name = name
        laptop.hersteller = hersteller
        laptop.service_tag = service_tag
        laptop.user_password = user_password
        laptop.dongle_id = dongle_id
        laptop.vol_c_id = vol_c_id
        laptop.mac_addresse = mac_addresse
        laptop.puma_und_concerto_version = puma_und_concerto_version
        laptop.puma_und_concerto_lizenz_datum = puma_und_concerto_lizenz_datum
        laptop.lynx_version = lynx_version
        laptop.lynx_lizenz_datum = lynx_lizenz_datum
        laptop.cameo_version = cameo_version
        laptop.cameo_lizenz_datum = cameo_lizenz_datum
        laptop.creta_version = creta_version
        laptop.creta_lizenz_datum = creta_lizenz_datum
        laptop.gewaehrleistung = gewaehrleistung

        db.session.commit()

        return redirect(url_for('modify_laptop.update_laptop_info', laptop_id=laptop_id))
    return render_template('laptop_edit.html', laptop=laptop)

@modify_laptop_bp.route('/delete_laptop/<int:laptop_id>', methods=['POST'])
def delete_laptop(laptop_id):
    laptop = Laptop.query.get_or_404(laptop_id)

    # Check if the user confirmed the deletion
    confirm_delete = request.form.get('confirm_delete')
    flash(confirm_delete)
    if confirm_delete == 'yes':
        db.session.delete(laptop)
        db.session.commit()
        flash(f'{laptop.name} has been deleted', 'success')
    else:
        flash('Deletion cancelled', 'info')

    return redirect(url_for('modify_laptop.modify_laptop_page'))



