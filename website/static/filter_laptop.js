
flatpickr("#dates", {
  mode: "range",
  dateFormat: "d.m",
  onClose: function(selectedDates, dateStr, instance) {
    // Handle selected date range here
    console.log("Selected Dates:", selectedDates);
    console.log("Formatted Date String:", dateStr);
  }
});


function showAvailableLaptops() {
    var laptopList = document.getElementById('laptopListContainer').querySelector('#laptopList');
    var filterContainer = document.getElementById('filterContainer');
    var chooseLaptopButton = document.getElementById('choose_laptop_button');

    // Toggle visibility of laptop list and filter options
    if (laptopList.style.display === 'none') {
        // If laptop list is hidden, show it along with filter options
        laptopList.style.display = 'block';
        filterContainer.style.display = 'block';
    } else {
        // If laptop list is visible, hide both laptop list and filter options
        laptopList.style.display = 'none';
        filterContainer.style.display = 'none';
    }

}

function applyFilter() {
    // Get the criteria and query from the input fields
    var criteria = document.getElementById('filterCriteria').value;
    var query = document.getElementById('filterInput').value;

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

function renderLaptops(filteredLaptops) {
    var filtered_laptop_list = document.getElementById('filtered_laptop_list');
    var filtered_laptops = document.getElementById('filtered_laptops');

    // Clear previous content
    availableLaptops.innerHTML = '';

    // Iterate over the filtered laptops and create list items
    filteredLaptops.forEach(function(laptop) {
        console.log(laptop)
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

    // Show the laptop list
    filtered_laptop_list.style.display = 'block';
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
    var suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(function(suggestion) {
        var listItem = document.createElement('li');
        listItem.textContent = suggestion;
        listItem.addEventListener('click', function() {
            // Handle selection of suggestion
            document.getElementById('filterInput').value = suggestion;
            // Trigger filtering process
            applyFilter();
        });
        suggestionsList.appendChild(listItem);
    });

    var suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.style.display = 'block';
}

// Call getSuggestions whenever the input field value changes
var filterInput = document.getElementById('filterInput');
filterInput.addEventListener('input', function() {
    var criteria = document.getElementById('filterCriteria').value;
    var partialQuery = filterInput.value.trim();
    if (partialQuery !== '') {
    fetchSuggestions(criteria, partialQuery); // Fetch suggestions if query is not empty
    }
    else {
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = ''; // Clear suggestions if query is empty
  }
});

function selectLaptops() {
  var selectedLaptops = document.querySelectorAll('.laptop-checkbox:checked');
    // Debugging: Display selected laptops
    var selectedLaptopIds = Array.from(selectedLaptops).map(laptop => laptop.value);
    alert("Selected Laptops: " + selectedLaptopIds); // or console.log

  // Display the selected laptops in the form
  var form = document.getElementById('selectedLaptopsForm');
  form.innerHTML = '';  // Clear previous selections

  selectedLaptops.forEach(function (laptop) {
    var listItem = document.createElement('li');
    listItem.textContent = laptop.nextElementSibling.textContent;
    form.appendChild(listItem);
  });

  var laptopListContainer = document.getElementById('laptopListContainer');
  laptopListContainer.style.display='none';
}
document.getElementById('selectButton').addEventListener('click', selectLaptops);
document.getElementById("submitButton").addEventListener("click", function() {
});