// Function to show the confirmation modal
function showConfirmationModal(title, message, confirmButtonText, cancelButtonText, confirmAction, showForm) {
    $('#confirmationModalLabel').text(title);
    $('#confirmationMessage').text(message);
    $('#confirmButton').text(confirmButtonText);
    $('#cancelButton').text(cancelButtonText);


    //showForm to show entry name by confirmation window. True, then show it.
    //False dont show it, especially by submit booking, user dont need to put their name again to confirm this booking

    if (showForm) {
        $('#confirmationForm').show();
    }
    else {
        $('#confirmationForm').hide();
    }

    //Show confirmation modal
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
        $('#userName').val('');

    });

}




//Booking confirmation in homepage
$('#submitBookingButton').on('click',function(){

    var bookingForm = document.getElementById('bookingForm');
    var title = 'Confirm Booking';
    var message = 'Are you sure you want to submit this booking?';

    var confirmAction = function(userName) {
        var confirmInput = document.createElement('input');
        confirmInput.type = 'hidden';
        confirmInput.name = 'confirm_submit';
        confirmInput.value = 'yes';
        bookingForm.appendChild(confirmInput);

        bookingForm.submit();

        confirmInput.value = '';

    };
    showConfirmationModal(title, message, 'Submit', 'Cancel', confirmAction,false);
});

//deleteBookingButton by admin bookings
// $('#deleteBookingButton').on('click',function(){ for id
// $('.deleteBookingButton').on('click',function(){ for class
//why class? bookingId value then get after this button clicked, id is with booking id specified

$('.deleteBookingButton').on('click', function() {

    var bookingId = $(this).attr('id').split('_')[1]; //from button id
    var deleteBookingForm = $('#deleteBookingForm_' + bookingId);

    var title = 'Confirm Delete';
    var message = 'Are you sure you want to delete this booking?';
    var userName = $('#userName').val(); // get username from confirmation window html


    // Clear input after close or reopen this window
    userName="";

    var confirmAction = function(userName) {
        // Create and append the userName input
        var userNameInput = $('<input>', {
            type: 'hidden',
            name: 'user_name',
            value: userName
        }).appendTo(deleteBookingForm);



        // Create and append the confirmDelete input
        var confirmInput = $('<input>', {
            type: 'hidden',
            name: 'confirm_delete',
            value: 'yes'
        }).appendTo(deleteBookingForm);



        //submit form
        deleteBookingForm.submit();

        // Reset the value of userNameInput and confirmInput after form submission
        userNameInput.val('');
        confirmInput.val('');
    };

    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction, true);
});



//updateBookingButton by admin bookings
$('.updateBookingButton').on('click',function(){

    var bookingId = $(this).attr('id').split('_')[1];
    var updateBookingForm = $('#updateBookingForm_' + bookingId);

    var title = 'Confirm Update';
    var message = 'Are you sure you want to update this booking?';
    var userName = $('#userName').val();

    // Clear input after close or reopen this window
    userName="";

    var confirmAction = function(userName) {
        var userNameInput = $('<input>', {
            type: 'hidden',
            name: 'user_name',
            value: userName
        }).appendTo(updateBookingForm);



        // Create and append the confirmDelete input
        var confirmInput = $('<input>', {
            type: 'hidden',
            name: 'confirm_update',
            value: 'yes'
        }).appendTo(updateBookingForm);


        //submit form
        updateBookingForm.submit();

        // Reset the value of userNameInput and confirmInput after form submission
        userNameInput.val('');
        confirmInput.val('');
    };

    showConfirmationModal(title, message, 'Update', 'Cancel', confirmAction, true);
});



//deleteLaptopButton by modify laptop page
$('.deleteLaptopButton').on('click',function(){

    var laptopId = $(this).attr('id').split('_')[1]; //from button id
    var deleteLaptopForm = $('#deleteLaptopForm_' + laptopId);

    var title = 'Confirm Delete Laptop';
    var message = 'Are you sure you want to delete this laptop?';
    var userName = $('#userName').val();

    userName = "";


    var confirmAction = function(userName) {

        var userNameInput = $('<input>', {
            type: 'hidden',
            name: 'user_name',
            value: userName
        }).appendTo(deleteLaptopForm);


        var confirmInput = $('<input>', {
            type: 'hidden',
            name: 'confirm_delete',
            value: 'yes'
        }).appendTo(deleteLaptopForm);

        deleteLaptopForm.submit();

        userNameInput.val('');
        confirmInput.val('');
    };
    showConfirmationModal(title, message, 'Delete', 'Cancel', confirmAction,true);
});


//saveLaptopButton by modify laptop page
$('.saveLaptopButton').on('click',function(){

    var laptopId = $(this).attr('id').split('_')[1]; //from button id
    console.log(laptopId);
    var modifyLaptopForm = $('#modifyLaptopForm_' + laptopId); //need specify id for update laptop specification

    var title = 'Confirm Update Laptop';
    var message = 'Are you sure you want to update this laptop specification?';
    var userName = $('#userName').val();

    userName = "";


    var confirmAction = function(userName) {

        var userNameInput = $('<input>', {
            type: 'hidden',
            name: 'user_name',
            value: userName
        }).appendTo(modifyLaptopForm);


        var confirmInput = $('<input>', {
            type: 'hidden',
            name: 'confirm_update', // server get data with access to this variable
            value: 'yes'
        }).appendTo(modifyLaptopForm);

        modifyLaptopForm.submit();

        confirmInput.value = '';

        userNameInput.val('');
        confirmInput.val('');

    };
    showConfirmationModal(title, message, 'Save', 'Cancel', confirmAction,true);
});

//addNewLaptopButton by add laptop page
$('.addNewLaptopButton').on('click',function(){

    var addNewLaptopForm = $('#addNewLaptopForm');

    var title = 'Confirm Add a new Laptop';
    var message = 'Are you sure you want to add a new laptop?';
    var userName = $('#userName').val();

    userName = "";


    var confirmAction = function(userName) {

        var userNameInput = $('<input>', {
            type: 'hidden',
            name: 'user_name',
            value: userName
        }).appendTo(addNewLaptopForm);


        var confirmInput = $('<input>', {
            type: 'hidden',
            name: 'confirm_adding_laptop', // server get data with access to this variable
            value: 'yes'
        }).appendTo(addNewLaptopForm);

        addNewLaptopForm.submit();

        confirmInput.value = '';

        userNameInput.val('');
        confirmInput.val('');

    };
    showConfirmationModal(title, message, 'Save', 'Cancel', confirmAction,true);
});
