from website import create_app, db
from website.models import Laptop,Booking

def print_laptops():
    # Create a Flask app and push an application context
    app = create_app()
    app.app_context().push()

    laptops = Laptop.query.all()

    print("Laptop Information:")
    print(laptops)
    for laptop in laptops:
        print(f"ID: {laptop.id}, Name: {laptop.name_laptop}, Hersteller: {laptop.hersteller}, booking_id: {laptop.booking_id}" )

def print_booking():
    app = create_app()
    app.app_context().push()

    bookings= Booking.query.all()
    for booking in bookings:
        print(f"ID: {booking.id}, Name: {booking.name}, Status: {booking.status}")



if __name__ == "__main__":
    print_laptops()
    print_booking()