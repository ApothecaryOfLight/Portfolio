"use strict";


/*
Function to switch between interfaces.

target_interface: The interface to display.
*/
function switch_interface( target_interface ) {
    //Create an array of available interface DOM ID names.
    const interfaces = [
        "edit_blog_interface",
        "error_log_container",
        "edit_portfolio_interface"
    ];

    //Iterate through each entry in the list.
    interfaces.forEach( (interface_name) => {
        //Get a reference to this interface.
        const interface_reference = document.getElementById(interface_name);

        if( interface_name == target_interface ) {
            //If this interface is the target interface, display it.
            interface_reference.style.display = "block";
        } else {
            //If this is not the target interface, hide it.
            interface_reference.style.display = "none";
        }
    });
}