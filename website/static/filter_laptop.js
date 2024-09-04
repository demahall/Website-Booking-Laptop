var laptopListContainer = document.getElementById('laptopListContainer');
var laptopList = document.getElementById('laptopList');
var filterContainer = document.getElementById('filterContainer');
var filterInput = document.getElementById('filterInput');
var selectButton = document.getElementById('selectButton');
var selectFilteredButton = document.getElementById('selectFilteredButton');
var availableLaptops = document.getElementById('availableLaptops');
var suggestionsList = document.getElementById('suggestionsList');
var selectedLaptopsForm = document.getElementById('selectedLaptopsForm');
var selectLaptopList = document.getElementById('selectedLaptopList');
var selectedSuggestion = '';
var selectedLaptopIds = new Set();



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
    fetch('/filter')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
                renderLaptops(data);
            })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying a message to the user
        });
}

function renderLaptops(filteredLaptops) {
    availableLaptops.innerHTML = '';
    // Iterate over the filtered laptops and create list items
    filteredLaptops.forEach(function(laptop) {
        var listItem = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'laptop' + laptop.id;
        checkbox.name = 'selected_laptops';
        checkbox.value = laptop.id;
        checkbox.classList.add('laptop-checkbox');

        // Check if this laptop was previously selected and mark it as checked
        if (selectedLaptopIds.has(laptop.id)) {
            checkbox.checked = true;
        }

        // Add an event listener to track when a laptop is checked or unchecked
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedLaptopIds.add(laptop.id); // Add to selected set
            } else {
                selectedLaptopIds.delete(laptop.id); // Remove from selected set
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
        console.log('selectedlaptopIdsSet',selectedLaptopIds);
    });
}

function fetchSuggestions(criteria, partialQuery) {
    fetch('/suggestions', {
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
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(function(suggestion) {
        var listItem = document.createElement('li');
        listItem.innerHTML = suggestion.replace(/\n/g, '<br>'); // Display suggestion with newline breaks
        listItem.dataset.suggestionValue = suggestion; // Store unaltered suggestion text as a custom data attribute
        listItem.addEventListener('click', function() {
            // Handle selection of suggestion
            selectedSuggestion = this.dataset.suggestionValue; // Store unaltered suggestion text in the global variable
            document.getElementById('filterInput').value = selectedSuggestion; // Set filter input value to the selected suggestion
            // Trigger filtering process
            suggestionsList.style.display = 'none' ;
        });
        suggestionsList.appendChild(listItem);
    });

    var suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.style.display = 'block';

}

function applyFilter() {
    // Get the criteria and query from the input fields
    var criteria = document.getElementById('filterCriteria').value;
    var query = selectedSuggestion;

    // Send a POST request to the server with the criteria and query
    fetch('/filter', {
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

filterInput.addEventListener('input', function() {
    var criteria = document.getElementById('filterCriteria').value;
    var partialQuery = filterInput.value.trim();

    suggestionsList.style.display= 'block';
    if (partialQuery !== '') {
    fetchSuggestions(criteria, partialQuery); // Fetch suggestions if query is not empty
    }
    else {
    suggestionsList.innerHTML = ''; // Clear suggestions if query is empty
  }
});

function selectLaptops() {

    // Show the selected laptops section
    selectLaptopList.style.display = 'block';

    //Take laptops that checked
    console.log('selectedLaptopIds in selectLaptops',selectedLaptopIds);

    // Clear previous selections
    var form = document.getElementById('selectedLaptopsForm');

    // Iterate over selected laptops (checkboxes) and update Set
    var selectedLaptops = document.querySelectorAll('.laptop-checkbox:checked');
    console.log(selectedLaptops);

    selectedLaptops.forEach(function (laptop) {
        var laptopId = parseInt(laptop.value);
        console.log( laptopId);
        console.log(typeof laptopId);
        console.log(typeof selectedLaptopIds);

        // Add to the Set to ensure unique IDs
        if (!selectedLaptopIds.has(laptopId)) {
            selectedLaptopIds.add(laptopId);
        }
    });

    // Render the selected laptops based on the updated Set
    form.innerHTML = '';

    // Use Set to display all selected laptops
    selectedLaptopIds.forEach(function (laptopId) {
        var listItem = document.createElement('li');
        var laptopLabel = document.querySelector(`label[for="laptop${laptopId}"]`);

        if (laptopLabel) {
            listItem.textContent = laptopLabel.textContent; // Display the label of the selected laptop
            form.appendChild(listItem);
        }
    });

}

// Event Listeners
document.getElementById('selectButton').addEventListener('click', selectLaptops);
document.getElementById('applyFilterButton').addEventListener('click', applyFilter);

// Reset filter input on choose laptops
function resetFilterInput() {
    document.getElementById('filterInput').value = '';
    filteredLaptopList.querySelector('#filtered_laptops').innerHTML = '';
}


