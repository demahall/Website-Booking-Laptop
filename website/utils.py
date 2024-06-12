from website import db
from website.models import Log
from flask import request,flash


def generate_log_message(action, **kwargs):

    user_name = kwargs.get('user_name','')

    if action == 'booking laptops':
        name = kwargs.get('name', '')
        selected_dates = kwargs.get('selected_dates', '')
        laptops = kwargs.get('laptops', [])
        comment = kwargs.get('comment', '')

        laptop_details = [f"Name: {laptop.name}, ID: {laptop.id}" for laptop in laptops]
        print(f"Laptop Details: {laptop_details}")  # Debugging

        log_message = (
            f"User booking laptops with "
            f"name: {name}, dates: {selected_dates}, "
            f"laptops: [{'; '.join(laptop_details)}] and Comment: {comment}"
        )
        log_action(name, action, log_message)

    elif action == 'change status booking':
        booking_id = kwargs.get('booking_id')
        current_status = kwargs.get('current_status','')
        new_status = kwargs.get('new_status','')

        log_message = (
            f"User change Booking {booking_id} from {current_status} to "
            f"{new_status}"
        )
        log_action(user_name,action,log_message)

    elif action == 'delete booking':
        booking_id = kwargs.get('booking_id')

        log_message = (
            f"User delete Booking {booking_id}"
        )
        log_action(user_name,action,log_message)

    elif action == 'add laptop':
        laptop_name = kwargs.get('name','')
        log_message = (
            f"User add a laptop under the name {laptop_name} into database"
        )
        log_action(user_name,action,log_message)

    elif action == 'updated laptop':
        laptop_id = kwargs.get('laptop_id')
        changes = kwargs.get('changes',{})

        change_details = []
        for key, change in changes.items():
            change_details.append(f"{key}: {change['old']} -> {change['new']}")

        log_message = (
            f"User update laptop with ID {laptop_id} and "
            f"changes: {', '.join(change_details)}"
        )
        log_action(user_name, action, log_message)

    elif action == 'delete laptop':
        laptop_id = kwargs.get('laptop_id')
        laptop_name = kwargs.get('laptop_name','')

        log_message = (
            f"User delete laptop {laptop_name} with laptop ID {laptop_id}"
        )
        log_action(user_name, action, log_message)

def log_action(user_id, action, details=None):

    log_entry = Log(user_id=user_id, action=action, details=details)
    db.session.add(log_entry)
    db.session.commit()





