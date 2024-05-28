var criteriaButton = document.getElementById('criteriaButton');
var criteriaDropdown = document.getElementById('criteriaDropdown');
var applyFilterButton = document.getElementById('applyFilterButton');
var laptopTable = document.getElementById('table');


document.addEventListener('DOMContentLoaded', function() {

    criteriaButton.addEventListener('click', function() {
        // Toggle the display style of the dropdown menu
        if (criteriaDropdown.style.display === 'none') {
            criteriaDropdown.style.display = 'block';
        } else {
            criteriaDropdown.style.display = 'none';
        }
    });

    applyFilterButton.addEventListener('click',function(){

        if (criteriaDropdown.style.display = 'block'){
            criteriaDropdown.style.display = 'none';
            }
    });
});


// Function to fetch filtered laptops based on selected criteria
function fetchFilteredLaptops(selectedCriteria) {
    var selectedOptions = criteriaDropdown.selectedOptions;
    var selectedCriteria = [];
    // Iterate over the selected options and add them to the selected criteria array
    for (var i = 0; i < selectedOptions.length; i++) {
        var criterion = selectedOptions[i].value;
        selectedCriteria.push(criterion);
    }
    console.log(selectedCriteria)

    fetch('/show_laptop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ criteria: selectedCriteria })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch filtered laptops');
        }
    })
    .then(filteredLaptops => {
        // Once data is fetched, call renderFilteredLaptops function to render it
        console.log(filteredLaptops)
        renderFilteredLaptops(filteredLaptops);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to render filtered laptops on the page
function renderFilteredLaptops(filteredLaptops) {

    var laptopTable = document.getElementById('laptopTable');
    laptopTable.innerHTML = ''; // Clear previous data

    // Create table header
    var tableHeader = document.createElement('thead');
    var headerRow = document.createElement('tr');
    Object.keys(filteredLaptops).forEach(criterion => {
        var formattedCriterion = formatKey(criterion); // Format the criterion key
        var headerCell = document.createElement('th');
        headerCell.textContent = formattedCriterion;
        headerRow.appendChild(headerCell);
    });
    tableHeader.appendChild(headerRow);
    laptopTable.appendChild(tableHeader);

    // Calculate the width of the table container based on the number of headers
    var numHeaders = Object.keys(filteredLaptops).length;
    var tableContainer = document.getElementById('table-container');
    var containerWidth = numHeaders * 250; // Adjust this value as needed
    tableContainer.style.width = containerWidth + 'px';

    // Create table body
    var tableBody = document.createElement('tbody');
    var numRows = Math.max(...Object.values(filteredLaptops).map(arr => arr.length));
    for (var i = 0; i < numRows; i++) {
        var row = document.createElement('tr');
        Object.values(filteredLaptops).forEach(criteria => {
            var cell = document.createElement('td');
            cell.textContent = criteria[i] !== undefined ? criteria[i] : ''; // Check for undefined values
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    }
    laptopTable.appendChild(tableBody);
}

function formatKey(key) {
        // Split the key by underscores and capitalize each word
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }