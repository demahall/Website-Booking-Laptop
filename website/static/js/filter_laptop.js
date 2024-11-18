var laptopListContainer = document.getElementById('laptopListContainer');
var laptopList = document.getElementById('laptopList');
var filterContainer = document.getElementById('filterContainer');
var filterInput = document.getElementById('filterInput');
var selectButton = document.getElementById('selectButton');
var availableLaptops = document.getElementById('availableLaptops');
var suggestionsList = document.getElementById('suggestionsList');
var selectedLaptopsForm = document.getElementById('selectedLaptopsForm');
var selectLaptopList = document.getElementById('selectedLaptopList');
var selectedSuggestion = '';
var selectedLaptopIds = new Set();

function handleChooseLaptops() {
    if (laptopListContainer.style.display === 'none' || laptopListContainer.style.display === '') {

        laptopListContainer.style.display = 'flex';
        laptopList.style.display = 'block'; // Show laptop list
        filterContainer.style.display = 'block'; // Always show the filter
        selectLaptopList.style.display = 'none'; // Hide selected laptops list


        // Reset filter input and hide filtered list
        document.getElementById('filterInput').value = '';
        showAvailableLaptops();

    } else {
        // Hide the entire container and reset
        laptopListContainer.style.display = 'none';
        laptopList.style.display = 'none';
        filterContainer.style.display = 'none';
        selectLaptopList.style.display = 'none';

        // Reset filter input and hide filtered list
        document.getElementById('filterInput').value = '';
    }
}

function showAvailableLaptops() {

    // Fetch and display all available laptops
    fetch('/api/filter')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
                console.log(data);
                renderLaptops(data);
            })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying a message to the user
        });
}

function renderLaptops(laptops) {
    availableLaptops.innerHTML = ''; // Clear the previous list

    // Iterate over the laptops and create list items
    laptops.forEach(function(laptop) {
        var listItem = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'laptop' + laptop.id;
        checkbox.name = 'selected_laptops';
        checkbox.value = laptop.id;
        checkbox.classList.add('laptop-checkbox');

        // Check if this laptop was previously selected and mark it as checked
        selectedLaptopIds.forEach(function(tuple) {
            if (tuple[0] === laptop.id) {
                checkbox.checked = true;
            }
        });

        // Add event listener to track when a laptop is checked or unchecked
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Add [laptopId, laptopName] tuple to the Set
                selectedLaptopIds.add([laptop.id, laptop.name]);
            } else {
                // Remove the tuple from the Set
                selectedLaptopIds.forEach(function(tuple) {
                    if (tuple[0] === laptop.id) {
                        selectedLaptopIds.delete(tuple);
                    }
                });
            }
        });

        var label = document.createElement('label');
        label.htmlFor = 'laptop' + laptop.id;
        label.textContent = laptop.name;

        // Add spacing between checkbox and label
        label.style.marginLeft = '10px';

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        availableLaptops.appendChild(listItem);
    });
}


function fetchSuggestions(criteria, partialQuery) {
    fetch('/api/suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'criteria': criteria,
            'partial_query': partialQuery
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(suggestions => {
        renderSuggestions(suggestions);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function renderSuggestions(suggestions) {

    var suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(function(suggestion) {
        var listItem = document.createElement('li');
        listItem.innerHTML = suggestion.replace(/\n/g, '<br>'); // Display suggestion with newline breaks
        listItem.dataset.suggestionValue = suggestion; // Store unaltered suggestion text as a custom data attribute
        suggestionsList.appendChild(listItem);

        listItem.addEventListener('click', function() {
            // Handle selection of suggestion
            selectedSuggestion = this.dataset.suggestionValue; // Store unaltered suggestion text in the global variable

            document.getElementById('filterInput').value = selectedSuggestion; // Set filter input value to the selected suggestion
            // Trigger filtering process
            suggestionsList.style.display = 'none';
            suggestionsContainer.style.display = 'none';
        });
    });

    suggestionsContainer.style.display = 'block';
    suggestionsList.style.display = 'block';  // Ensure the list itself is displayed
}

function applyFilter() {
    // Get the criteria and query from the input fields
    var criteria = document.getElementById('filterCriteria').value;
    var query = selectedSuggestion;

    // Send a POST request to the server with the criteria and query
    fetch('/api/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'criteria': criteria,
            'query': query
        })
    })
    .then(response => {
        if (response.ok) {
            // If response is successful, return the HTML content
            return response.json();
        } else {
            // If response is not successful, throw an error
            throw new Error('Network response was not ok.');
        }
    })
    .then(filteredLaptops  => {
        renderLaptops(filteredLaptops);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error here, such as displaying a message to the user
    });

}

function selectLaptops() {

    // Show the selected laptops section
    selectLaptopList.style.display = 'block';

    //Take laptops that checked
    console.log('selectedLaptopIds in selectLaptops',selectedLaptopIds);

    // Clear previous selections
    var form = document.getElementById('selectedLaptopsForm');

    // Render the selected laptops based on the updated Set
    form.innerHTML = '';

    // Iterate over selected laptops (checkboxes) and update Set
    var selectedLaptops = document.querySelectorAll('.laptop-checkbox:checked');
    console.log(selectedLaptops);

    selectedLaptops.forEach(function (laptop) {
        var laptopId = parseInt(laptop.value);
        var laptopName = laptop.nextElementSibling.textContent;
        console.log( laptopId);
        console.log(typeof laptopId);
        console.log(typeof selectedLaptopIds);

        /// Check if this laptopId already exists in selectedLaptopIds
        if (![...selectedLaptopIds].some(tuple => tuple[0] === laptopId)) {
            // If not, add the tuple [laptopId, laptopName]
            selectedLaptopIds.add([laptopId, laptopName]);
        }
    });

    // Use Set to display all selected laptops
    selectedLaptopIds.forEach(function (tuple) {
        var laptopName = tuple[1];
        var listItem = document.createElement('li');

        listItem.textContent = laptopName;
        form.appendChild(listItem);

    });

}

// Core logic that handles filtering and visibility
function handleFilterChange() {
    var criteria = filterCriteria.value;
    var partialQuery = filterInput.value.trim();

    // If "All" is selected
    if (criteria === 'all') {
        filterInput.style.display = 'none';
        filterInput.value = ''; // Clear the input value
        suggestionsList.style.display = 'none'; // Hide suggestions
        showAvailableLaptops(); // Show all laptops (this is your function)

    } else {
        // Show input field for other criteria
        filterInput.style.display = 'block';

        // Fetch suggestions only if query is not empty
        if (partialQuery !== '') {
            fetchSuggestions(criteria, partialQuery);
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if query is empty
            suggestionsList.style.display = 'none'; // Hide suggestions
        }
    }
}

//Dates Configuration
flatpickr("#dates", {
    mode: "range",
    dateFormat: "d.m.Y",
    minDate: "today", // Set minimum date to today
    weekNumbers: true, // Show week numbers
    onChange: function(selectedDates, dateStr, instance) {

        // Convert the selected week range into dates
        if (selectedDates.length === 2) {
            const startDate = selectedDates[0];
            const endDate = selectedDates[1];

            // Format the dates and update the input value
            const startDateFormatted = flatpickr.formatDate(startDate, "d.m.Y");
            const endDateFormatted = flatpickr.formatDate(endDate, "d.m.Y");

            instance.setDate([startDateFormatted, endDateFormatted]);
        }
        else {
            const date = flatpickr.formatDate(selectedDates,"d.m.Y");
            instance.setDate([date])
        }
    }
});


// Event Listeners
document.getElementById('selectButton').addEventListener('click', selectLaptops);
document.getElementById('applyFilterButton').addEventListener('click', applyFilter);

filterCriteria.addEventListener('change', function() {
    filterInput.value = ''; // Clear the input value
    handleFilterChange(); // Call core logic when filter criteria changes
});

filterInput.addEventListener('input', function() {
   handleFilterChange();
});

// Initial check on page load to adjust input visibility
handleFilterChange();




