
flatpickr("#dates", {
  mode: "range",
  dateFormat: "d.m",
  onClose: function(selectedDates, dateStr, instance) {
    // Handle selected date range here
    console.log("Selected Dates:", selectedDates);
    console.log("Formatted Date String:", dateStr);
  }
});

function showFilter {
    const availLaptops = document.getElementById('availLaptops');
    const filterContainer = document.getElementById('filterContainer');
    const filteredLaptopsContainer = document.getElementById('filteredLaptopsContainer');

    // Toggle visibility of laptop list container
    if (availLaptops.style.display === 'none') {
        // Show laptop list container
        availLaptops.style.display = 'block';
        // Hide filter container
        filterContainer.style.display = 'none';
        // Hide filtered laptops container
        filteredLaptopsContainer.style.display = 'none';
        // Reset filtered laptops list
        document.getElementById('filteredLaptopsList').innerHTML = '';
    }
    else {
        // Hide laptop list container
        availLaptops.style.display = 'none';
        // Hide filter container
        filterContainer.style.display = 'none';
        // Reset filtered laptops container
        filteredLaptopsContainer.style.display = 'none';
        // Reset filtered laptops list
        document.getElementById('filteredLaptopsList').innerHTML = '';
    }
}

function showLaptopList() {
    var laptopList = document.getElementById('laptopList');
    if (laptopList.style.display === 'none'){
        laptopList.style.display = 'block';
    }
    else {
        laptopList.style.display = 'none'}
}
function showAvailableLaptops() {
  var filterContainer = document.getElementById('filteredLaptopsContainer');
  if (filterContainer.style.display === 'none') {
    filterContainer.style.display = 'block';
  }
   else {
    filterContainer.style.display = 'none';
  }
}

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

