// This java script module is to process the data flow from database and visualize it dynamically into laptop information page

var criteriaButton = document.getElementById('criteriaButton');
var criteriaDropdownContainer = document.getElementById('criteriaDropdownContainer');
var applyFilterButton = document.getElementById('applyFilterButton');
var laptopTable = document.getElementById('table');


document.addEventListener('DOMContentLoaded', function() {
    fetchFilteredLaptops(); // Automatically fetch and display laptops when the page loads


    //Handling the visibility of filter feature window by clicking "Filter Options" and "Apply Filter" buttons

    criteriaButton.addEventListener('click', function() {
        // Toggle the display style of the dropdown menu
        if (criteriaDropdownContainer.style.display === 'none') {
            criteriaDropdownContainer.style.display = 'block';
            //criteriaDropdown.style.display = 'block';
        } else {
            criteriaDropdownContainer.style.display = 'none';
        }
    });

    applyFilterButton.addEventListener('click',function(){

        if (criteriaDropdownContainer.style.display = 'block'){
            criteriaDropdownContainer.style.display = 'none';
            }
    });
});



function fetchFilteredLaptops() {

    // Get filtered laptops from database based on selected criteria and then throw the data into renderFilteredLaptops function
    // Input: selectedOptions -> selected laptop's criteria from html
    // Output: -

    var selectedOptions = criteriaDropdown.selectedOptions;
    var selectedCriteria = [];

    // Iterate over the selected options and add them to the selected criteria array
    for (var i = 0; i < selectedOptions.length; i++) {
        var criterion = selectedOptions[i].value;
        selectedCriteria.push(criterion);
    }


    fetch('/api/show_laptop', {
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
        renderFilteredLaptops(filteredLaptops);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function renderFilteredLaptops(filteredLaptops) {
    // Render filtered laptops on the laptop information page
    // Input: filtered laptops data information
    // Output: dynamically table of the information

    // Define default headers
    const defaultHeaders = ["Laptop Name", "Hersteller", "Dongle ID"];
    const selectedHeaders = Object.keys(filteredLaptops);

    // Combine default headers with additional selected headers
    const allHeaders = [...defaultHeaders];

    // Add additional headers only if they are not part of the default ones
    selectedHeaders.forEach(header => {
        if (!defaultHeaders.includes(header)) {
            allHeaders.push(header);
        }
    });

    // Clear previous table data
    var laptopTable = document.getElementById('laptopTable');
    laptopTable.innerHTML = ''; // Clear previous data

    // Create table header
    var tableHeader = document.createElement('thead');
    var headerRow = document.createElement('tr');
    allHeaders.forEach(header => {
        var formattedCriterion = formatKey(header); // Format the criterion key
        var headerCell = document.createElement('th');
        headerCell.textContent = formattedCriterion;
        headerRow.appendChild(headerCell);
    });
    tableHeader.appendChild(headerRow);
    laptopTable.appendChild(tableHeader);

    // Calculate the width of the table container based on the number of headers
    var numHeaders = allHeaders.length;
    var tableContainer = document.getElementById('table-container');
    var containerWidth = numHeaders * 250; // Adjust this value as needed
    tableContainer.style.width = containerWidth + 'px';

    // Create table body
    var tableBody = document.createElement('tbody');
    var numRows = Math.max(...Object.values(filteredLaptops).map(arr => arr.length));
    for (var i = 0; i < numRows; i++) {
        var row = document.createElement('tr');
        allHeaders.forEach(header => {
            var cell = document.createElement('td');
            var criteria = filteredLaptops[header] || [];  // Safely access the criteria array
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