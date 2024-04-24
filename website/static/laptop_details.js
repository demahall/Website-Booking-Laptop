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

document.addEventListener('DOMContentLoaded', function() {
    var criteriaButton = document.getElementById('criteriaButton');
    var criteriaDropdown = document.getElementById('criteriaDropdown');
    var applyFilterButton = document.getElementById('applyFilter');
    var laptopTable = document.getElementById('table');

    criteriaButton.addEventListener('click', function() {
        // Toggle the display style of the dropdown menu
        if (criteriaDropdown.style.display === 'none') {
            criteriaDropdown.style.display = 'block';
        } else {
            criteriaDropdown.style.display = 'none';
        }
    });

    // Add click event listener to Apply Filter button
    applyFilterButton.addEventListener('click', function() {
        // Get the selected options from the criteria dropdown
        var selectedOptions = criteriaDropdown.selectedOptions;

        console.log(selectedOptions)

        // Create an array to store the selected criteria
        var selectedCriteria = [];

        // Iterate over the selected options and add them to the selected criteria array
        for (var i = 0; i < selectedOptions.length; i++) {
            var criterion = selectedOptions[i].value;
            selectedCriteria.push(criterion);
        }


    });


});
