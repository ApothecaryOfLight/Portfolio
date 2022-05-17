"use strict";


/*
Function be called when the user selects a portfolio entry from the drop down.
*/
function select_portfolio_entry() {
    //Get a reference to the project selector dropdown.
    const dropdown = document.getElementById("portfolio_dropdown");

    //If the dropdown selector's value is -1, then it's a new project.
    if( dropdown.value == -1 ) {
        //Blank the fields.
        blank_portfolio_fields();

        //Attach the relevant event listeners.
        attach_edit_portfolio_events();

        //End the function.
        return;
    }

    //Get the value of the project dropdown selector.
    const entity_value = dropdown.value;

    //Send a request to the server for the requested project.
    const get_portfolio_entry = new Request(
        ip + "get_portfolio_entry/" + entity_value
    );
    fetch( get_portfolio_entry )
        .then( response => response.json() )
        .then( json => {
            //Blank the input fields.
            blank_portfolio_fields( entity_value );

            //Render the project in the input fields.
            render_portfolio_entry( json.portfolio_entry );

            //Add the images to the global object that stores images.
            Object.assign( portfolio_images, json.images );

            //Render the images of the project.
            render_portfolio_image_gallery();

            //Attach relevant event listeners.
            attach_edit_portfolio_events( entity_value );
        });
}