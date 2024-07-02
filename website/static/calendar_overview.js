
// Example data, replace with your actual data source
const bookings = [
    { laptopId: 101, type: '1 bed', status: 'ready', bookingId: 'A-12', startDate: '2017-03-02', endDate: '2017-03-23', status: 'New, Paid' },
    // Add more booking objects as needed
];

const laptopData = [
    { id: 101, type: '1 bed', status: 'ready' },
    // Add more laptop objects as needed
];



document.addEventListener('DOMContentLoaded', function () {
    let currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();


    function updateCalendar() {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        monthHeader.colSpan = daysInMonth; // Update colspan to match days in month
        monthHeader.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        daysHeader.innerHTML = ''; // Clear existing day headers
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            daysHeader.appendChild(dayCell);
        }
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    }

    function previousMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    }

    function goToCurrentMonth() {
        currentDate = new Date(); // Reset to current date
        updateCalendar();
    }

    // Initial setup
    updateCalendar();

    // Bind these functions to your previous and next buttons
    document.getElementById('nextMonthButton').addEventListener('click', nextMonth);
    document.getElementById('previousMonthButton').addEventListener('click', previousMonth);
    document.getElementById('currentMonthButton').addEventListener('click', goToCurrentMonth);
});


