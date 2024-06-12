// Function to show the confirmation modal
function showConfirmationModal(title, message, confirmButtonText, cancelButtonText, confirmAction, showForm) {
    $('#confirmationModalLabel').text(title);
    $('#confirmationMessage').text(message);
    $('#confirmButton').text(confirmButtonText);
    $('#cancelButton').text(cancelButtonText);

    if (showForm) {
        $('#confirmationForm').show();
    }
    else {
        $('#confirmationForm').hide();
    }

    $('#confirmationModal').modal('show');

    $('#confirmButton').off('click').on('click', function() {
        if (showForm) {
            var userName = $('#userName').val();
            if (userName) {
                confirmAction(userName);
                $('#confirmationModal').modal('hide');
                $('#userName').val('');  // Clear the input after action
            } else {
                alert('Please enter your name.');
            }
        } else {
            confirmAction();
            $('#confirmationModal').modal('hide');
        }
    });

    $('#cancelButton').off('click').on('click', function() {
        $('#confirmationModal').modal('hide');
    });

}


// Example usage for delete laptop confirmation
//TODO delete laptop button di html nya ubah variabel supaya ersichtlich
$('#deleteButton').on('click', function() {
    var laptopId = $(this).attr('id').split('_')[1];
    console.log(laptopId);
    var title = 'Confirm Delete';
    var message = 'Are you sure you want to delete this laptop?';
    var confirmAction = function() {

        fetch(`/delete_laptop/${laptopId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: userName,
                action: 'delete laptop',
                confirm_delete : 'yes'

            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to delete laptop');
            }
        })
        .then(data => {
            console.log('Laptop deleted:', data);
            // Show the flash message
            const flashMessageDiv = document.createElement('div');
            flashMessageDiv.className = 'alert alert-success';
            flashMessageDiv.innerHTML = 'Laptop deleted successfully';
            document.body.prepend(flashMessageDiv);
            // Optionally reload the page or update the UI
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction,true);
});

// Example usage for booking confirmation
$('#submitButton').on('click', function() {
    var title = 'Confirm Booking';
    var message = 'Are you sure you want to submit this booking?';
    var confirmAction = function() {
        // Code to handle booking submission

        $('#confirmSubmitInput').val("yes");
        //Erweitern und verallgemeinern!
        $('#bookingForm').submit();
        $('#confirmSubmitInput').val('');
    };
    showConfirmationModal(title, message, 'Submit', 'Cancel', confirmAction,false);
});

// Example usage for delete booking confirmation
$('.updateBookingButton').on('click', function() { //updateBookingButton referenced of class in html

    var bookingId = $(this).attr('id').split('_')[1];
    var title = 'Confirm Update';
    var message = 'Are you sure you want to update this booking?';

    //clear input after close or reopen this window
    $('#userName').val("");

    //get userName from confirmation_window.html
    var userName = document.getElementById('userName').value;
    console.log(userName);
    // userName value transfer into deletebookingform html


    var confirmAction = function(userName) {
        // Code to handle delete action
        $('#confirmUpdateInput_' + bookingId).val("yes");
        $('#userNameInputa_' + bookingId).val(userName);
        $('#updateBookingForm_' + bookingId).submit();
        $('#userNameInputa_' + bookingId).val("");
        $('#confirmUpdateInput_' + bookingId).val("");
    };
    showConfirmationModal(title, message, 'Update', 'Cancel', confirmAction,true);
});

// Example usage for delete booking confirmation
$('.deleteBookingButton').on('click', function() {

    var bookingId = $(this).attr('id').split('_')[1];
    var title = 'Confirm Delete';
    var message = 'Are you sure you want to delete this booking?';

    //clear input after close or reopen this window
    $('#userName').val("");

    //get userName from confirmation_window.html
    var userName = document.getElementById('userName').value;
    console.log(userName);
    // userName value transfer into deletebookingform html
    $('#userNameInputb_' + bookingId).val(userName);

    var confirmAction = function(userName) {
        // Code to handle delete action
        $('#confirmDeleteInput_' + bookingId).val("yes");
        $('#userNameInputb_' + bookingId).val(userName);
        $('#deleteBookingForm_' + bookingId).submit();
        $('#userNameInputb_' + bookingId).val("");
        $('#confirmDeleteInput_' + bookingId).val("");
    };
    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction,true);
});

