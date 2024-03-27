from website import create_app, db
from website.models import Laptop,Booking
from sqlalchemy.orm import Session
from sqlalchemy import and_

app = create_app()

with app.app_context():
    session = Session()

app.app_context().push()

def filter_laptops(selected_criteria):
    # Initialize a dictionary to store the filtered criteria for each laptop
    filtered_laptops = {}

    # Iterate over each laptop in the database
    for laptop in Laptop.query.all():
        # Initialize a list to store the filtered criteria for the current laptop
        laptop_criteria = []

        # Iterate over each selected criterion
        for criterion in selected_criteria:
            # Check if the criterion exists as an attribute of the laptop
            if hasattr(laptop, criterion):
                # Get the value of the criterion for the current laptop
                criterion_value = getattr(laptop, criterion)
                # Add the criterion and its value to the list of filtered criteria
                laptop_criteria.append(f"{criterion.capitalize()}: {criterion_value}")

        # Store the filtered criteria for the current laptop
        filtered_laptops[laptop.name] = laptop_criteria

    print (filtered_laptops.items())



def print_booking():


    bookings= Booking.query.all()

    for booking in bookings:
        print(f"ID: {booking.id}, Name: {booking.name}, Status: {booking.status}, Laptops: {booking.laptops}")

def available_laptop():
    available_laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

    print(f'{available_laptops}')
def change_status(booking_id,new_status):

    booking = session.query(Booking,booking_id)
    if booking:

        booking.status = new_status

        db.session.commit()
    else:
        print('booking id not found')


def delete_booking(booking_ids):

    for booking_id in booking_ids:
        booking = db.session.query(Booking).get(booking_id)
        if booking:
            db.session.delete(booking)
        else:
            return
    # Commit the changes
    db.session.commit()

def new_bookings(name, calendar_week, laptop_ids):


    new_booking = Booking(
        name=name,
        calendar_week = calendar_week
    )

    db.session.add(new_booking)
    db.session.commit()

    for laptop_id in laptop_ids:
        laptop = db.session.query(Laptop).get(laptop_id)

        if laptop and not laptop.booking_id:
            laptop.booking_id = new_booking.id
            new_booking.laptops.append(laptop)
            db.session.commit()

    print('Booking created successfully')


def return_laptop(booking_id):

    booking = db.session.query(Booking).get(booking_id)


    if not booking:
        print(f'Booking with ID {booking_id} not found.')
        return

    booking.status = "Returned"

    for laptop in booking.laptops:
        laptop.booking_id = None  # Remove booking association from the laptop
    db.session.commit()

    print(f'Laptop returned successfully from booking {booking_id}')





if __name__ == "__main__":

    available_laptop()
    #new_bookings(name='Danil Doe', calendar_week=2, laptop_ids=[1,2])
    #return_laptop(booking_id=5)
    #reset_laptops()
    #change_status(1,'Returned')
    #delete_booking()
    #print_booking()
    #filter_laptops(['hersteller','mac_addresse'])

