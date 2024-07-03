const bookings = [
    {
        id: 1,
        name: "Fahru",
        status: "Booked",
        startDate: "2024-07-02",
        endDate: "2024-08-10",
        details: "Paid"
    },
    {
        id: 2,
        name: "Lisa",
        status: "Confirmed",
        startDate: "2024-07-05",
        endDate: "2024-09-08",
        details: "Unpaid"
    }
];



document.addEventListener('DOMContentLoaded', function () {

    monthHeader = document.getElementById('monthHeader');
    let currentDate = new Date();
    currentMonth = currentDate.getMonth()+1; //index from 0
    currentYear = currentDate.getFullYear();
    const calendarBody = document.getElementById("calendarBody");


    function nextMonth() {
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
        updateCalendar(currentMonth, currentYear);
    }

    function previousMonth() {
        currentMonth--;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }
        updateCalendar(currentMonth, currentYear);

    }

    function goToCurrentMonth() {
        currentDate = new Date();
        currentMonth = currentDate.getMonth()+1;
        currentYear = currentDate.getFullYear();
        updateCalendar(currentMonth,currentYear);
    }

    function updateCalendar(month,year) {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const daysInMonth = new Date(year, month, 0).getDate();
        monthHeader.colSpan = daysInMonth; // Update colspan to match days in month
        monthHeader.textContent = `${monthNames[month-1]} ${year}`; //index array from 0

        daysHeader.innerHTML = ''; // Clear existing day headers

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            daysHeader.appendChild(dayCell);
        }

        populateCalendar();
    }

    //handling booking box display
    function handlingBookingCell(booking){

        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        //adjust with start column of the table, in this case is two

        let startIndex = 2;
        let endIndex = monthHeader.colSpan+1;
        let spanLength = endIndex - startIndex +1;


        // Condition 1: Both dates are within the current month
        if (bookingStart.getMonth() + 1 === currentMonth && bookingStart.getFullYear() === currentYear &&
            bookingEnd.getMonth() + 1 === currentMonth && bookingEnd.getFullYear() === currentYear) {
            startIndex = bookingStart.getDate() + 1; // +2 to adjust for first two non-booking columns
            endIndex = bookingEnd.getDate() + 1;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 2: Start date is within the current month, end date extends beyond it
        else if (bookingStart.getMonth() + 1 === currentMonth && bookingStart.getFullYear() === currentYear) {
            startIndex = bookingStart.getDate() + 1;
            endIndex = endIndex;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 3: Start date is before the current month, end date is within it
        else if (bookingEnd.getMonth() + 1 === currentMonth && bookingEnd.getFullYear() === currentYear) {
            startIndex = startIndex;
            endIndex = bookingEnd.getDate() + 1;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 4: Booking spans over the entire displayed month
        else if (bookingStart < new Date(currentYear, currentMonth - 1, 1) && bookingEnd > new Date(currentYear, currentMonth, 0)) {
            startIndex= startIndex;
            endIndex = endIndex;
            spanLength = spanLength;
        }

        //Condition 5. There are no Booking over the entire displayed month
        else {
            startIndex = 0; // dont pass to if logic below
            spanLength = 0;
        }

        //to create booking cell
        return [startIndex,endIndex,spanLength];

    }

    function createBookingCell(booking,widthCell) {

        const cell = document.createElement('td');
        cell.className = 'booking-cell';
        cell.colSpan = widthCell; // Custom function to calculate the span

        const header = document.createElement('div');
        header.className = 'booking-header';
        header.textContent = booking.name; // Booking made by

        const dates = document.createElement('div');
        dates.className = 'booking-dates';
        dates.textContent = `${booking.startDate} - ${booking.endDate}`;

        const status = document.createElement('div');
        status.className = 'booking-status';
        status.textContent = booking.status;


        cell.appendChild(header);
        cell.appendChild(dates);
        cell.appendChild(status);

        return cell;
    }

    function populateCalendar() {

        calendarBody.innerHTML = ''; // Clear existing calendar entry

        bookings.forEach(booking => {

            //create new row, make column in a row sequentially or in order !
            const row = document.createElement("tr");

            // Create name cell in that row
            const nameCell = document.createElement("td");
            nameCell.textContent = booking.name;
            row.appendChild(nameCell);

            // Create status cell in that row
            const statusCell = document.createElement("td");
            statusCell.textContent = booking.status;
            row.appendChild(statusCell);

            // Prepare to fill the rest of the row with empty cells
            for (let i = 1; i <= monthHeader.colSpan; i++) {
                 row.appendChild(document.createElement("td"));
            }

            //get information of where should I put this bookingCell
            [startIndex,endIndex,spanLength] = handlingBookingCell(booking);

            //createBookingCell based on their position
            bookingCell = createBookingCell(booking,spanLength);

            // Create and insert the booking cell if conditions are met
            if (startIndex >= 2 && spanLength > 0) {

                row.cells[startIndex].replaceWith(bookingCell); // Replace starting cell with booking cell

                // Remove excess cells covered by the span
                for (let i = 1; i < spanLength; i++) {
                    if (row.cells[startIndex+1]) { // Check if the next cell exists before trying to remove it
                        row.removeChild(row.cells[startIndex+1]); // Always remove the next cell after the start
                    }
                }
            }
            calendarBody.appendChild(row);
        });
    }

    // Initial setup
    updateCalendar(currentMonth,currentYear);

    // Bind these functions to your previous and next buttons
    document.getElementById('nextMonthButton').addEventListener('click', nextMonth);
    document.getElementById('previousMonthButton').addEventListener('click', previousMonth);
    document.getElementById('currentMonthButton').addEventListener('click', goToCurrentMonth);

});


