document.addEventListener('DOMContentLoaded', function() {
    // Get all laptop name elements
    var laptopNames = document.querySelectorAll('.laptop-name');

    // Add mouseover event listener to each laptop name
    laptopNames.forEach(function(laptopName) {
        var laptopId = laptopName.getAttribute('data-laptop-id');

        // Fetch hover information for the laptop using AJAX
        fetch(`/laptop_information/${laptopId}`)
            .then(response => response.json())
            .then(data => {
                // Construct tooltip content
                var tooltipContent = '';
                if (data.borrower_name && data.borrowing_duration) {
                    tooltipContent = `Gebucht von : ${data.borrower_name}, Zeitraum: von ${data.borrowing_duration}`;
                } else {
                    tooltipContent = 'Noch nicht gebucht';
                }

                // Add tooltip to laptop name element
                laptopName.setAttribute('data-toggle', 'tooltip');
                laptopName.setAttribute('title', tooltipContent);
                laptopName.addEventListener('mouseover', function() {
                    // Show tooltip
                    $(this).tooltip('show');
                });
            })
            .catch(error => console.error('Error fetching hover information:', error));
    });
});

// Function to toggle the visibility of the dropdown menu
window.onload = function() {
    var criteriaButton = document.getElementById('criteriaButton');
    var criteriaDropdown = document.getElementById('criteria');
    var applyFilter = document.getElementById('applyFilter');
    var table = document.getElementById('table');

    criteriaButton.addEventListener('click', function() {
        // Toggle the display style of the dropdown menu
        if (criteriaDropdown.style.display === 'none') {
            criteriaDropdown.style.display = 'block';

        } else {
            criteriaDropdown.style.display = 'none';
        }
    });

    applyFilter.addEventListener('click', function() {
        // Hide the menu upon form submission
        console.log(criteriaDropdown)
        criteriaDropdown.style.display = 'none';
        table.style.display = 'block' ;
              // Get the selected options
        var selectedOptions = criteriaDropdown.selectedOptions;

        // Create an array to store the selected values
        var selectedValues = [];

        // Iterate over the selected options to get their values
        for (var i = 0; i < selectedOptions.length; i++) {
            var selectedValue = selectedOptions[i].value;
            selectedValues.push(selectedValue);
        }

        // Now, selectedValues array contains all the selected values
        console.log(selectedValues);
    });
};
