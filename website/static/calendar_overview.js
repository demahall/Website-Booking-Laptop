// Example data, replace with your actual data source
const bookings = [
    { laptopId: 101, type: '1 bed', status: 'ready', bookingId: 'A-12', startDate: '2017-03-02', endDate: '2017-03-23', status: 'New, Paid' },
    // Add more booking objects as needed
];

const laptopData = [
    { id: 101, type: '1 bed', status: 'ready' },
    // Add more laptop objects as needed
];

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


let currentDate = new Date();
currentMonth = currentDate.getMonth();
currentYear = currentDate.getFullYear();


function loadCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    calendarBody.innerHTML = '';
    document.getElementById('currentMonthYear').textContent = `${monthName} ${year}`;
    updateDaysHeader();

    laptopData.forEach(laptop => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = laptop.id;
        row.appendChild(idCell);

        const typeCell = document.createElement('td');
        typeCell.textContent = laptop.type;
        row.appendChild(typeCell);

        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status', laptop.status.replace(' ', '-'));
        statusSpan.textContent = laptop.status;
        statusCell.appendChild(statusSpan);
        row.appendChild(statusCell);

        const calendarCell = document.createElement('td');
        calendarCell.colSpan = daysInMonth(currentMonth + 1, currentYear);
        row.appendChild(calendarCell);

        bookings.forEach(booking => {
            if (booking.laptopId === laptop.id) {
                const bookingElement = document.createElement('div');
                bookingElement.classList.add('booking');
                bookingElement.style.left = `${(new Date(booking.startDate).getDate() - 1) * 32}px`; // 32px per day
                bookingElement.style.width = `${(new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24) * 32}px`;
                bookingElement.style.backgroundColor = 'orange';
                bookingElement.innerHTML = `<span>${booking.bookingId}<br>${booking.startDate} - ${booking.endDate}<br>${booking.status}</span>`;
                calendarCell.appendChild(bookingElement);
            }
        });

        calendarBody.appendChild(row);
    });
}

function updateDaysHeader() {
    const daysHeader = document.getElementById('daysHeader');
    daysHeader.innerHTML = '';
    const daysInCurrentMonth = daysInMonth(currentMonth + 1, currentYear);
    for (let day = 1; day <= daysInCurrentMonth; day++) {
        const dayCell = document.createElement('th');
        dayCell.textContent = day;
        daysHeader.appendChild(dayCell);
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function previousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    loadCalendar();
}

function nextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    loadCalendar();
}

function goToCurrentMonth() {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    loadCalendar();
}

document.addEventListener('DOMContentLoaded', loadCalendar);
