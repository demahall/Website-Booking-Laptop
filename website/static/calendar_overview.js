const startDateEl = document.getElementById('start-date');
const endDateEl = document.getElementById('end-date');
const tbody = document.querySelector('tbody');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');

// ... existing logic for rooms and bookings ...

let currentDate = new Date(); // Initially set to current date

function getDisplayedDates() {
  const displayedDates = [];
  const firstDay = currentDate.getDay();
  currentDate.setDate(currentDate.getDate() - firstDay);

  for (let i = 0; i < 7; i++) {
    displayedDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return displayedDates;
}

function updateDisplayedWeek(direction) {
  const daysToAdd = direction === 'prev' ? -7 : 7;
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  populateTable(); // Re-populate table with updated dates
}

function setDisplayedDateRange(startDate, endDate) {
  startDateEl.textContent = startDate.toLocaleDateString();
  endDateEl.textContent = endDate.toLocaleDateString();
}

function populateTable() {
  // ... existing logic to populate table with room data and booking blocks ...

  const displayedDates = getDisplayedDates();
  setDisplayedDateRange(displayedDates[0], displayedDates[displayedDates.length - 1]); // Call the function here

  // Update table header with full day names and dates
  const tableHeader = tbody.parentNode.querySelector('thead tr:nth-child(2)');
  for (let i = 0; i < displayedDates.length; i++) {
    const dateCell = tableHeader.children[i + 3]; // Skip first 3 cells (number, type, status)
    dateCell.textContent = displayedDates[i].toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }); // Update format
  }
}

populateTable(); // Initial table population

prevWeekBtn.addEventListener('click', () => updateDisplayedWeek('prev'));
nextWeekBtn.addEventListener('click', () => updateDisplayedWeek('next'));
