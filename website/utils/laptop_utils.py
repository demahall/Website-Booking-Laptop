from website.models import Laptop


def get_available_laptops():
    from website.api.laptop_api import load_laptops  # Import locally to avoid circular dependencies

    all_laptops = load_laptops()
    if all_laptops is None:
        all_laptops = load_laptops()  # Ensure laptops are loaded

    # Assuming each laptop can be linked to multiple bookings, you'd need to verify no active booking is marked as 'booked'
    available_laptops = [
        laptop for laptop in all_laptops
        if not any(booking.status == 'booked' for booking in laptop.bookings)
    ]

    # Optionally sort the laptops by name
    available_laptops.sort(key=lambda laptop: laptop.name)  # Example sorting by name

    return available_laptops

def search_laptops(query,criteria):
    available_laptops = get_available_laptops()
    filtered_laptops = []

    if query and criteria:
        if criteria == 'all':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops]
        if criteria == 'name':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.name and query.lower() in laptop.name.lower()]
        if criteria == 'hersteller':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.hersteller and query.lower() in laptop.hersteller.lower()]
        elif criteria == 'dongle_id':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.dongle_id and query.lower() in laptop.dongle_id.lower()]
        elif criteria == 'mac_addresse':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.mac_addresse and query.lower() in laptop.mac_addresse.lower()]
        elif criteria == 'lynx_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.lynx_version and query.lower() in laptop.lynx_version.lower()]
        elif criteria == 'puma_und_concerto_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops
                                if
                                laptop.puma_und_concerto_version and query.lower() in laptop.puma_und_concerto_version.lower()]
        elif criteria == 'puma_ice_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops
                                if laptop.puma_ice_version and query.lower() in laptop.puma_ice_version.lower()]
        elif criteria == 'puma_batterie_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops
                                if
                                laptop.puma_batterie_version and query.lower() in laptop.puma_batterie_version.lower()]
        elif criteria == 'puma_eMotor_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops
                                if laptop.puma_eMotor_version and query.lower() in laptop.puma_eMotor_version.lower()]
        elif criteria == 'creta_version':
            filtered_laptops = [laptop.serialize() for laptop in available_laptops if
                                laptop.creta_version and query.lower() in laptop.creta_version.lower()]

        return filtered_laptops

    else:
        return [laptop.serialize() for laptop in available_laptops]


def sort_laptop_name(laptop):
    parts = laptop.name.split()  # Split the name by spaces
    numeric_part = int(parts[-1]) if parts[-1].isdigit() else float('inf')  # Extract the numeric part
    return (parts[0], numeric_part)

def filter_laptops(selected_criteria, laptops):
    filtered_laptops = {"Laptop Name": [laptop.name for laptop in laptops],
                        "Hersteller": [laptop.hersteller for laptop in laptops],
                        "Dongle ID": [laptop.dongle_id for laptop in laptops]}

    for criterion in selected_criteria:
        if hasattr(Laptop, criterion):
            filtered_laptops[criterion] = [getattr(laptop, criterion) for laptop in laptops]
    return filtered_laptops
