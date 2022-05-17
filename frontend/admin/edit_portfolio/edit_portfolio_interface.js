"use strict";


/*
Function to initialize the edit portfolio interface.
*/
function initialize_edit_portfolio_interface() {
  //Attach event listeners to their appropriate elements.
  attach_edit_portfolio_events();

  //Get a list of projects from the server and populate the dropdown with them.
  get_portfolio_entries();
}


/*
Function to generate a new local unique identifier.
*/
function generate_new_local_id() {
  //Create an array to store ids.
  const local_ids = [];
  
  //Iterate through every image.
  for( const index in portfolio_images ) {
    //Store this image's ID in the local_ids array.
    local_ids.push( portfolio_images[index].local_image_id );
  }

  //Set the ID to 0.
  let new_local_id = 0;

  //Find the first ID that doesn't already exist.
  while( local_ids.includes( new_local_id ) ) {
    new_local_id++;
  }

  //Return the new ID.
  return new_local_id;
}