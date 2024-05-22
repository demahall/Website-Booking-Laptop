from website import create_app, db
from website.models import Laptop,Booking
from sqlalchemy.orm import Session
from sqlalchemy import or_

app = create_app()

with app.app_context():
    session = Session()

app.app_context().push()

def filter_laptops(selected_criteria):
    # Initialize a dictionary to store the filtered criteria for each laptop
    laptops = Laptop.query.all()
    filtered_laptops = {}

    # Retrieve the bookings for each laptop and associate them with the laptops
    laptop_bookings = {}
    for laptop in laptops:
        bookings = laptop.bookings
        booking = next((b for b in bookings if b.status == "booked"), None)
        if booking:
            laptop_bookings[laptop.name] = f'{booking.name} from {booking.selected_dates}'
        else:
            laptop_bookings[laptop.name] = 'noch nicht gebucht'

    # Populate the filtered laptops dictionary with laptop names, borrowers, and selected dates
    filtered_laptops["Laptop Name"] = [laptop.name for laptop in laptops]
    filtered_laptops["Booked by"] = [laptop_bookings[laptop.name] for laptop in laptops]

    # Populate the filtered laptops dictionary with other selected criteria
    for criterion in selected_criteria:
        filtered_laptops[f'{criterion.capitalize()}'] = [getattr(laptop, criterion) for laptop in laptops]

    print(filtered_laptops["Laptop Name"])
    print(filtered_laptops["Booked by"])



def print_booking():


    bookings= Booking.query.all()

    for booking in bookings:
        print(f"ID: {booking.id}, Name: {booking.name}, Status: {booking.status}, Laptops: {[laptop.name for laptop in booking.laptops]}, Booking Date: {booking.date}")

def available_laptop():
    # Retrieve laptops that are not currently booked
    laptops = Laptop.query.filter(Laptop.booking_id.is_(None)).all()

    booked_laptops = Laptop.query.filter(Laptop.booking_id.isnot(None)).all()

    filtered_booked_laptops= []
    for laptop in booked_laptops:
        print(laptop)
        if db.session.query(Booking).get(laptop.booking_id).status != 'booked':
            filtered_booked_laptops.append(laptop)

    # Combine laptops and booked_laptops (using a set for efficient duplicate removal)
    laptops = set(laptops + filtered_booked_laptops)

    laptops = list(laptops)
    print(laptops)
    # Sort the laptops using the custom sorting function
    laptops.sort(key=sort_laptop_name)
    print(laptops)

    print(f'{[laptop.name for laptop in laptops]}')

def sort_laptop_name(laptop):
    parts = laptop.name.split()  # Split the name by spaces
    numeric_part = int(parts[-1]) if parts[-1].isdigit() else float('inf')  # Extract the numeric part
    return (parts[0], numeric_part)  # Tuple for sorting

def get_suggestions():
    haha='hersteller'
    partial_query = 'DELL'
    laptops = available_laptop()
    if haha in Laptop.__table__.columns:
        columns = [getattr(laptop,haha) for laptop in laptops]
        suggestions = [suggestion for suggestion in columns if partial_query.lower() in suggestion.lower()]
        suggestions = list(set(suggestions))
        print(suggestions)

def change_status(booking_id,new_status):

    booking = session.query(Booking,booking_id)
    if booking:

        booking.status = new_status

        db.session.commit()
    else:
        print('booking id not found')

def show_and_delete_booking(booking_ids):

    laptops_with_booking = Laptop.query.filter(Laptop.booking_id != None).all()
    print([laptop.name for laptop in laptops_with_booking])
    print([laptop.booking_id for laptop in laptops_with_booking])

    laptops_to_delete = Laptop.query.filter_by(booking_id=booking_ids).all()

    if laptops_to_delete :
        for laptop in laptops_to_delete:
            laptop.booking_id = None

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


def laptop_status(laptop_id):

    laptop = db.session.query(Laptop).get(laptop_id)

    if laptop.booking_id is not None:
        print(db.session.query(Booking).get(laptop.booking_id).status)


    print(f'Laptop with {laptop.name} is {laptop.booking_id} and {laptop.bookings}')


if __name__ == "__main__":
    #show_and_delete_booking(4)
    available_laptop()
    #new_bookings(name='Danil Doe', calendar_week=2, laptop_ids=[1,2])
    #return_laptop(booking_id=5)
    #reset_laptops()
    #change_status(1,'Returned')
    #delete_booking([4])
    #print_booking()
    laptop_status(15)
    #filter_laptops(['hersteller','mac_addresse'])


