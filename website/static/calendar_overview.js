document.addEventListener('DOMContentLoaded', function () {

    monthHeader = document.getElementById('monthHeader');
    let currentDate = new Date();
    currentMonth = currentDate.getMonth() + 1; //index from 0
    currentYear = currentDate.getFullYear();
    const calendarBody = document.getElementById("calendarBody");

    const bookingStatusDropDown = document.getElementById('bookingStatusDropDown');
    let currentStatus = bookingStatusDropDown.value || 'All'; // Set default status

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
        currentMonth = currentDate.getMonth() + 1;
        currentYear = currentDate.getFullYear();
        updateCalendar(currentMonth, currentYear);
    }

    function updateCalendar(month, year) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const daysInMonth = new Date(year, month, 0).getDate();
        monthHeader.colSpan = daysInMonth; // Update colspan to match days in month
        monthHeader.textContent = `${monthNames[month - 1]} ${year}`; //index array from 0

        daysHeader.innerHTML = ''; // Clear existing day headers

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year,month-1,day);
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            dayCell.className = 'day-cell';

            daysHeader.appendChild(dayCell);
        }
        //populateCalendar();
        fetchBookings(currentStatus);
    }

    //handling booking box display
    function handlingBookingCell(booking) {

        const bookingStart = booking.startDate;
        const bookingEnd = booking.endDate;


        console.log(bookingStart,bookingEnd);

        //adjust with start column of the table, in this case is two

        let startIndex = 2;
        let endIndex = monthHeader.colSpan + 1;
        let spanLength = endIndex - startIndex + 1;

        // Condition 1: Both dates are within the current month
        if (bookingStart[1] === currentMonth && bookingStart[2] === currentYear &&
            bookingEnd[1] === currentMonth && bookingEnd[2] === currentYear) {
            startIndex = bookingStart[0] + 1; // +2 to adjust for first two non-booking columns
            endIndex = bookingEnd[0] + 1;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 2: Start date is within the current month, end date extends beyond it
        else if (bookingStart[1] === currentMonth && bookingStart[2] === currentYear) {
            startIndex = bookingStart[0] + 1;
            endIndex = endIndex;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 3: Start date is before the current month, end date is within it
        else if (bookingEnd[1] === currentMonth && bookingEnd[2] === currentYear) {
            startIndex = startIndex;
            endIndex = bookingEnd[0] + 1;
            spanLength = endIndex - startIndex + 1;
        }

        // Condition 4: Booking spans over the entire displayed month
        else if (new Date(bookingStart[2],bookingStart[1]-1,bookingStart[0]) < new Date(currentYear, currentMonth - 1, 1)
                    && new Date(bookingEnd[2],bookingEnd[1]-1,bookingEnd[0]) > new Date(currentYear, currentMonth, 0)) {
            startIndex = startIndex;
            endIndex = endIndex;
            spanLength = spanLength;
        }

        //Condition 5. There are no Booking over the entire displayed month
        else {
            startIndex = 0; // dont pass to if logic below
            spanLength = 0;
        }

        //to create booking cell
        return [startIndex, endIndex, spanLength];

    }

    function createBookingCell(booking, widthCell) {

        const cell = document.createElement('td');
        cell.className = `booking-cell ${booking.status.toLowerCase()}`;
        cell.colSpan = widthCell; // Custom function to calculate the span

        const dateBoxWidth = 28;
        const bookingCellWidth = dateBoxWidth * widthCell;
        cell.style.width = `${bookingCellWidth}px`;

        const header = document.createElement('div');
        header.className = 'booking-header';
        header.textContent = booking.name; // Booking made by

        const dates = document.createElement('div');
        dates.className = 'booking-dates';


        if (booking.oneDay === true){
            dates.textContent = `${booking.startDate[0]}.${booking.startDate[1]}.${booking.startDate[2]}`;
        }
        else {
            dates.textContent = `${booking.startDate[0]}.${booking.startDate[1]}.${booking.startDate[2]} to
             ${booking.endDate[0]}.${booking.endDate[1]}.${booking.endDate[2]}`;
        }


        const status = document.createElement('div');
        status.className = 'booking-status';
        status.textContent = booking.status;

        cell.appendChild(header);
        cell.appendChild(dates);
        cell.appendChild(status);

        return cell;

    }

    function fetchBookings(selectedStatus) {

        if (!selectedStatus) {
            selectedStatus = null;
        }
        console.log(selectedStatus);

        fetch('/bookings_overview/get_bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: selectedStatus }) // Send the selected status as JSON
        })
        .then(response =>{
            if (response.ok) {
                // If response is successful, return the HTML content
                return response.json();
            } else {
                // If response is not successful, throw an error
                throw new Error('Network response was not ok.'+ response.statusText);
            }
        })
        .then(data => {
            console.log(data);
            populateCalendar(data);
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
        });
    }

    function populateCalendar(data) {

        calendarBody.innerHTML = ''; // Clear existing calendar entry

        data.forEach(booking => {

            //create new row, make column in a row sequentially or in order !
            const row = document.createElement("tr");
            row.className = 'booking-row';
            calendarBody.appendChild(row);

            // Create name cell in that row
            const nameCell = document.createElement("td");
            nameCell.textContent = booking.name;
            nameCell.className = 'book-by';
            row.appendChild(nameCell);

            // Create status cell in that row
            const statusCell = document.createElement("td");
            statusCell.textContent = booking.status;
            statusCell.className = 'status';
            row.appendChild(statusCell);

            // Prepare to fill the rest of the row with empty cells
            for (let i = 1; i <= monthHeader.colSpan; i++) {
                const dateBox = document.createElement("td");
                dateBox.className = 'date-box';
                row.appendChild(dateBox);

            }

            //get information of where should I put this bookingCell
            [startIndex, endIndex, spanLength] = handlingBookingCell(booking);
            console.log(startIndex,endIndex,spanLength);

            //createBookingCell based on their position
            bookingCell = createBookingCell(booking, spanLength);

            // Create and insert the booking cell if conditions are met
            if (startIndex >= 2 && spanLength > 0) {
                row.cells[startIndex].replaceWith(bookingCell); // Replace starting cell with booking cell

                // Remove excess cells covered by the span
                for (let i = 1; i < spanLength; i++) {
                    if (row.cells[startIndex + 1]) { // Check if the next cell exists before trying to remove it
                        row.removeChild(row.cells[startIndex + 1]); // Always remove the next cell after the start
                    }
                }
            }
            calendarBody.appendChild(row);
        });
    }


    // Initial setup
    updateCalendar(currentMonth, currentYear);
    fetchBookings(currentStatus);


    // Bind these functions to your previous and next buttons
    document.getElementById('nextMonthButton').addEventListener('click', nextMonth);
    document.getElementById('previousMonthButton').addEventListener('click', previousMonth);
    document.getElementById('currentMonthButton').addEventListener('click', goToCurrentMonth);

    //get Drop down options value from html whenever its changed
    document.getElementById('bookingStatusDropDown').addEventListener('change',function() {
        currentStatus = this.value;
        fetchBookings(currentStatus);
    });

    // Still on work with the sticky header while scrolling down the table

    const tableWrapper = document.querySelector('.calendar-table-wrapper');
    const tableHeader = document.querySelector('.calendar-table thead');

    tableWrapper.addEventListener('scroll', function () {
        if (tableWrapper.scrollTop > 0) {
            tableHeader.classList.add('sticky-header');
        }
        else {
            tableHeader.classList.remove('sticky-header');
        }
    });
});


