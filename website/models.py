from . import db
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

# Association Table
booking_laptop_association = db.Table(
    'booking_laptop_association',
    db.Column('booking_id', db.Integer, db.ForeignKey('booking.id')),
    db.Column('laptop_id', db.Integer, db.ForeignKey('laptop.id'))
)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(150))
    startDate = db.Column(db.DateTime(timezone=True))
    endDate = db.Column(db.DateTime(timezone=True))
    status = db.Column(db.String(20), default="Pending")
    date = db.Column(db.DateTime(timezone=True), default=func.now())

    laptops = db.relationship('Laptop', secondary=booking_laptop_association, back_populates='bookings',lazy= 'dynamic')


class Laptop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_laptop = db.Column(db.String(150))
    hersteller = db.Column(db.String(150))

    booking_id = db.Column(db.Integer,db.ForeignKey('booking.id'))
    bookings = db.relationship('Booking', back_populates='laptops')



