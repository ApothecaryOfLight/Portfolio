"use strict";


/*
Function to get blog posts.
*/
function get_existing_posts() {
  //Create a request for the server for a list of existing blog posts.
  const existing_request = new Request (
    ip + "get_existing_posts"
  );
  fetch( existing_request )
    .then( response => response.json() )
    .then( json => {
      //Render the existing posts to screen in the dropdown selector.
      compose_existing( json.existing );
    });
}


/*
Function to render existing posts drop down selector.
*/
function compose_existing( existing ) {
  //Create a string to store the HTML of the dropdown options.
  //The first option should have a value of -1 and a text value
  //of New Post, as -1 indicates that it is the first blog post in a new series.
  let dom_string = "<option value=\'-1\'>New Post</option>";

  //Iterate through every blog post provided by the server.
  for( const index in existing ) {
    //Add each post as an option to the HTML string.
    dom_string += "<option value=\'";
    dom_string += existing[index].post_id + "\'>";
    dom_string += existing[index].title + "</option>";
  }

  //Get a reference to the dropdown selector.
  const dropdown = document.getElementById("new_blog_old_post");

  //Assign the HTML string to the dropdown selector.
  dropdown.innerHTML = dom_string;
}


/*
Function to request an existing blog post from the server.

inPostID: Unique identifier of the post to fetch from the server.
*/
function load_blog_post( inPostID ) {
  //Request the existing blog post from the server.
  const existing_request = new Request (
    ip + "get_blog_post/" + inPostID
  );
  fetch( existing_request )
    .then( response => response.json() )
    .then( json => {
      //Reset the input fields.
      blank_fields();

      //Render the blog post in the input fields.
      render_blog_post( json.post_data );
    });

  //Request the blog images for this post from the server.
  const existing_images_request = new Request (
    ip + "get_blog_images/" + inPostID
  );
  fetch( existing_images_request )
    .then( response => response.json() )
    .then( json => {
      //Assign the images from the server to the global images.
      Object.assign( images, json.images_data );

      //Render the images.
      render_blog_images();
    });
}