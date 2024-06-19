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

        log_message = (
            f"{name} booked the following laptops for the dates {selected_dates}: "
            f"{', '.join(laptop_details)}. "
            f"Comment provided: '{comment}'."
        )

        log_action(name, action, log_message)

    elif action == 'change status booking':

        name = kwargs.get('name')
        selected_dates = kwargs.get('selected_dates')
        current_status = kwargs.get('current_status','')
        new_status = kwargs.get('new_status','')

        log_message = (
            f"Booking status for a booking from {name} from {selected_dates} has been changed from "
            f"'{current_status}' to '{new_status}'."
        )
        log_action(user_name,action,log_message)

    elif action == 'delete booking':

        name = kwargs.get('name')
        selected_dates = kwargs.get('selected_dates')

        log_message = (
            f"User deleted a booking from {name}, which scheduled for {selected_dates}"
        )
        log_action(user_name,action,log_message)

    elif action == 'add laptop':
        laptop_name = kwargs.get('name','')
        log_message = (
            f" A new laptop added with name '{laptop_name}' "
        )
        log_action(user_name,action,log_message)

    elif action == 'updated laptop':
        laptop_name = kwargs.get('laptop_name')
        changes = kwargs.get('changes',{})

        change_details = []
        for key, change in changes.items():
            change_details.append(f"{key}: {change['old']} -> {change['new']}")

        log_message = (
            f"User updated a laptop '{laptop_name}' with the following changes: {', '.join(change_details)}"
        )
        log_action(user_name, action, log_message)

    elif action == 'delete laptop':

        laptop_name = kwargs.get('laptop_name','')

        log_message = (
            f"User deleted a laptop with name '{laptop_name}' "
        )
        log_action(user_name, action, log_message)

def log_action(user_id, action, details=None):

    log_entry = Log(user_id=user_id, action=action, details=details)
    db.session.add(log_entry)
    db.session.commit()





