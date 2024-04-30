// Function to show the confirmation modal
function showConfirmationModal(title, message, confirmButtonText, cancelButtonText, confirmAction) {
    $('#confirmationModalLabel').text(title);
    $('#confirmationMessage').text(message);
    $('#confirmButton').text(confirmButtonText);
    $('#cancelButton').text(cancelButtonText);

    $('#confirmButton').off('click').on('click', function() {
        confirmAction();
        $('#confirmationModal').modal('hide');
    });

    $('#confirmationModal').modal('show');
}

// Example usage for delete confirmation
$('#deleteButton').on('click', function() {
    var title = 'Confirm Delete';
    var message = 'Are you sure you want to delete this laptop?';
    var confirmAction = function() {
        // Code to handle delete action
        $('#confirmDeleteInput').val("yes");
        $('#deleteForm').submit();
        $('#confirmDeleteInput').val("");
    };
    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction);
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
    showConfirmationModal(title, message, 'Submit', 'Cancel', confirmAction);
});


// Example usage for delete confirmation
$('.deleteBookingButton').on('click', function() {
    var bookingId = $(this).attr('id').split('_')[1];
    var title = 'Confirm Delete';
    var message = 'Are you sure you want to delete this booking?';
    var confirmAction = function() {
        // Code to handle delete action
        $('#confirmDeleteInput_' + bookingId).val("yes");
        $('#deleteBookingForm_' + bookingId).submit();
        $('#confirmDeleteInput_' + bookingId).val("");
    };
    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction);
});

