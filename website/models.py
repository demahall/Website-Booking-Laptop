from website import db
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import DateTime

# Association Table
booking_laptop_association = db.Table(
    'booking_laptop_association',
    db.Column('booking_id', db.Integer, db.ForeignKey('booking.id')),
    db.Column('laptop_id', db.Integer, db.ForeignKey('laptop.id'))
)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    selected_dates = db.Column(db.String(150))
    status = db.Column(db.String(20), default="Pending")
    date = db.Column(db.DateTime(timezone=True), default=func.now())

    laptops = db.relationship('Laptop', secondary=booking_laptop_association, back_populates='bookings')


class Laptop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    hersteller = db.Column(db.String(150))
    service_tag = db.Column(db.String(150))
    user_password = db.Column(db.String(150))
    dongle_id = db.Column(db.String(150))
    vol_c_id = db.Column(db.String(150))
    mac_addresse = db.Column(db.String(150))
    puma_und_concerto_version = db.Column(db.String(150))
    puma_und_concerto_lizenz_datum = db.Column(db.String(150))
    lynx_version = db.Column(db.String(150))
    lynx_lizenz_datum = db.Column(db.String(150))
    cameo_version = db.Column(db.String(150))
    cameo_lizenz_datum = db.Column(db.String(150))
    creta_version = db.Column(db.String(150))
    creta_lizenz_datum = db.Column(db.String(150))
    gewaehrleistung = db.Column(db.String(150))

    booking_id = db.Column(db.Integer,db.ForeignKey('booking.id'))
    bookings = db.relationship('Booking',secondary=booking_laptop_association, back_populates='laptops')

    def serialize(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'hersteller' : self.hersteller,
            'service_tag' :self.service_tag,
            'user_password' :self.user_password,
            'dongle_id'  :self.dongle_id,
            'vol_c_id' :self.vol_c_id,
            'mac_addresse'  : self.mac_addresse,
            'puma_und_concerto_version'  :self.puma_und_concerto_version,
            'puma_und_concerto_lizenz_datum' :self.puma_und_concerto_lizenz_datum,
            'lynx_version' :self.lynx_version,
            'lynx_lizenz_datum' :self.lynx_lizenz_datum,
            'cameo_version' :self.cameo_version,
            'cameo_lizenz_datum' :self.cameo_lizenz_datum,
            'creta_version' :self.creta_version,
            'creta_lizenz_datum':self.creta_lizenz_datum,
            'gewaehrleistung' :self.gewaehrleistung
        }


