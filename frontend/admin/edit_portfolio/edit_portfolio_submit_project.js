"use strict";


/*
Function to submit a portfolio entry to the server.
*/
function portfolio_submit_entry( existingPortfolioEntryID ) {
    //Get references to the project edit fields.
    const title_field = document.getElementById("portfolio_title_field");
    const github_field = document.getElementById("portfolio_github_field");
    const live_page_field = document.getElementById("portfolio_live_page_field");
    const description_field = document.getElementById("portfolio_description_field");
    const flags_field = document.getElementById("portfolio_flags_field");

    //Convert the values of the input fields into a consolidated object.
    const portfolio_entry_object = {
        "portfolio_entry_id": existingPortfolioEntryID,
        "title": process_outgoing_text( title_field.value ),
        "github": github_field.value,
        "live_page": live_page_field.value,
        "description": process_outgoing_text( description_field.value ),
        "flags": flags_field.value,
        "images": get_portfolio_images_object()
    };

    //Send the consolidated project object to the server.
    const submit_portfolio_request = new Request(
        ip + "add_portfolio_entry",
        {
            method: "POST",
            body: JSON.stringify( portfolio_entry_object ),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    fetch( submit_portfolio_request )
        .then( response => response.json() )
        .then( json => {
            if( json.result == "success" ) {
                //Blank the fields.
                blank_portfolio_fields();
            } else {
                //Upon error, log the issue.
                console.log( json.reason );
                console.log( "error" );
            }
         });
}


/*
Delete portfolio entry.

inEntityID: Unique identifier of the project to delete.
*/
function portfolio_delete( inEntityID ) {
    //Send a request to the server to delete the specified project.
    const delete_request = new Request(
        ip + "delete_entity/" + inEntityID
    );
    fetch( delete_request )
        .then( response => response.json() )
        .then( json => {
            //Reset the input fields.
            blank_portfolio_fields();
        });
}


/*
Function to get portfolio images and prepare them to be sent to the server.
*/
function get_portfolio_images_object() {
    //Create an array to store the portfolio images.
    const portfolio_images_object = [];
    
    //Iterate through every image.
    for( const index in portfolio_images ) {
      let image_id;

      //If this image doesn't have an ID, set the ID to null.
      if( !portfolio_images[index].image_id ) {
        image_id = null;
      } else {
        //Otherwise, set the image ID to the stored ID.
        image_id = portfolio_images[index].image_id;
      }

      //Add the processed image to the array.
      portfolio_images_object.push({
        "image_data": portfolio_images[index].image_data,
        "image_id": image_id
      });
    }

    //Return the processed image array, now formatted to be sent to the server.
    return portfolio_images_object;
  }