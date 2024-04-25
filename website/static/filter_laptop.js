var laptopListContainer = document.getElementById('laptopListContainer');
var laptopList = document.getElementById('laptopList');
var filterContainer = document.getElementById('filterContainer');
var selectButton = document.getElementById('selectButton');
var filteredLaptopList = document.getElementById('filteredLaptopList');
var availableLaptops = document.getElementById('availableLaptops');
var filtered_laptops = document.getElementById('filtered_laptops');
var suggestionsList = document.getElementById('suggestionsList')
var selectedSuggestion = '';



flatpickr("#dates", {
  mode: "range",
  dateFormat: "d.m",
  minDate: "today", // Set minimum date to today
  onClose: function(selectedDates, dateStr, instance) {
    // Handle selected date range here
    console.log("Selected Dates:", selectedDates);
    console.log("Formatted Date String:", dateStr);
  }
});

function handleChooseLaptops() {

    if (laptopListContainer.style.display === 'none') {
        // Show the laptop list and related elements
        laptopListContainer.style.display = 'block';
        filterContainer.style.display = 'block';
        laptopList.style.display = 'block';
        selectButton.style.display = 'block';


        // Reset filter input and hide filtered list
        document.getElementById('filterInput').value = '';
        filteredLaptopList.style.display = 'none';
        filteredLaptopList.querySelector('#filtered_laptops').innerHTML = '';

        // Fetch and display all available laptops
        showAvailableLaptops();
        selectButton.style.top = availableLaptops.getBoundingClientRect().bottom + 'px';

    } else {
        // Hide the laptop list and related elements
        laptopListContainer.style.display = 'none';
        filterContainer.style.display = 'none';
        laptopList.style.display = 'none';

        // Reset filter input and hide filtered list
        document.getElementById('filterInput').value = '';
        filteredLaptopList.style.display = 'none';
        filteredLaptopList.querySelector('#filtered_laptops').innerHTML = '';
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
            availableLaptops.innerHTML = ''; // Clear previous content
            console.log(data);
            data.forEach(function(laptop) {
                var listItem = document.createElement('li');
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'laptop' + laptop.id;
                checkbox.name = 'selected_laptops';
                checkbox.value = laptop.id;
                checkbox.classList.add('laptop-checkbox');

                var label = document.createElement('label');
                label.htmlFor = 'laptop' + laptop.id;
                label.textContent = laptop.name;

                listItem.appendChild(checkbox);
                listItem.appendChild(label);

                availableLaptops.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying a message to the user
        });
}

function renderLaptops(filteredLaptops) {
    // Clear previous content
    filtered_laptops.innerHTML = '';

    // Iterate over the filtered laptops and create list items
    filteredLaptops.forEach(function(laptop) {
        var listItem = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'laptop' + laptop.id;
        checkbox.name = 'selected_laptops';
        checkbox.value = laptop.id;
        checkbox.classList.add('laptop-checkbox');

        var label = document.createElement('label');
        label.htmlFor = 'laptop' + laptop.id;
        label.textContent = laptop.name;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);

        filtered_laptops.appendChild(listItem);
    });

    // Hidden the list of available laptops
    document.getElementById('laptopList').style.display = 'none';
    // Show the laptop list
    filteredLaptopList.style.display = 'block';
    selectButton.style.top = filteredLaptopList.getBoundingClientRect().bottom + 'px';
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
            applyFilter();
        });
        suggestionsList.appendChild(listItem);
    });

    var suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.style.display = 'block';
    selectButton.style.top = filteredLaptopList.getBoundingClientRect().bottom + 'px';
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
        console.log(filteredLaptops)
        renderLaptops(filteredLaptops);
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error here, such as displaying a message to the user
    });
}

// Call getSuggestions whenever the input field value changes
var filterInput = document.getElementById('filterInput');
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
    var selectedLaptops = document.querySelectorAll('.laptop-checkbox:checked');
    var selectedLaptopIds = new Set(); // Use a Set to store unique laptop IDs

    // Clear previous selections
    var form = document.getElementById('selectedLaptopsForm');
    form.innerHTML = '';

    // Iterate over selected laptops
    selectedLaptops.forEach(function (laptop) {
        var laptopId = laptop.value;

        // Check if the laptop ID has already been added
        if (!selectedLaptopIds.has(laptopId)) {
            // Add the laptop ID to the Set
            selectedLaptopIds.add(laptopId);

            // Create a list item for the selected laptop
            var listItem = document.createElement('li');
            listItem.textContent = laptop.nextElementSibling.textContent;
            form.appendChild(listItem);
        }
    });

    var laptopListContainer = document.getElementById('laptopListContainer');
    laptopListContainer.style.display = 'none';
}

document.getElementById('selectButton').addEventListener('click', selectLaptops);
document.getElementById("submitButton").addEventListener("click", function() {
    // Handle form submission if needed
});

