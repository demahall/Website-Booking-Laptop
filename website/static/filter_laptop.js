
flatpickr("#dates", {
  mode: "range",
  dateFormat: "d.m",
  onClose: function(selectedDates, dateStr, instance) {
    // Handle selected date range here
    console.log("Selected Dates:", selectedDates);
    console.log("Formatted Date String:", dateStr);
  }
});

$(document).ready(function() {
    $('#filterForm').submit(function(event) {
        event.preventDefault(); // Prevent default form submission
        var formData = $(this).serialize(); // Serialize form data
        $.post('/', formData, function(data) {
            // Update page content with filtered laptops data
            // For example, you can iterate over 'data' and append it to a <ul> element
        });
    });
});

function showAvailableLaptops() {
    var laptopList = document.getElementById('laptopListContainer').querySelector('#laptopList');
    var filterContainer = document.getElementById('filterContainer');

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
    fetch('/', {
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
            return response.text();
        } else {
            // If response is not successful, throw an error
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        // Update the laptop list container with the fetched HTML content
        document.getElementById('laptopListContainer').innerHTML = data;
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle the error here, such as displaying a message to the user
    });
}
document.getElementById('applyFilterButton').addEventListener('click', applyFilter);

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

function validateAndSubmit() {
    var name = document.getElementById('name').value.trim();
    var dates = document.getElementById('dates').value.trim();


    if (name === '' || dates === '') {
        alert('Please fill in all required fields.');
        return;
        }

      // If all validations pass, submit the form
      document.getElementById('bookingForm').submit();
    }

