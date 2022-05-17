"use strict";


/*
Function to get root blog posts.
*/
function get_roots() {
  //Request the root blog posts from the server.
  const roots_request = new Request (
    ip + "get_root_posts"
  );
  fetch( roots_request )
    .then( response => response.json() )
    .then( json => {
      //Render the root blog posts.
      compose_roots( json.roots );
    });
}


/*
Function to render the blog roots drop down menu.

roots: Object containing the root blog posts.
*/
function compose_roots( roots ) {
  //Create a string containing the HTML to render the dropdown selector for
  //root posts.
  let dom_string = "<option value=\'-1\'>New Series</option>";

  //Iterate through every blog post in the root blog posts object.
  for( const index in roots ) {
    dom_string += "<option value=\'";
    dom_string += roots[index].post_id + "\'>";
    dom_string += roots[index].title + "</option>";
  }

  //Get a reference to the root blog post dropdown selector.
  const dropdown = document.getElementById("new_blog_root");

  //Set the HTML content of the dropdown selector to the HTML string.
  dropdown.innerHTML = dom_string;
}


/*
Function to create a new blog post.
*/
function new_blog_old_post() {
  //Get a reference to the root blog post dropdown selector.
  const edit_post_dropdown = document.getElementById("new_blog_old_post");

  //Get the currently selected value from the dropdown selector.
  const edit_post_id = edit_post_dropdown.value;

  //If it is -1, then it is a new root post.
  if( edit_post_id != -1 ) {
    //Load the selected post by ID.
    load_blog_post( edit_post_id );

    //Attach relevant event listeners.
    attach_blog_interface_events( edit_post_id );
  } else {
    //Reset the input fields.
    blank_fields();

    //Attach the relevant event listeners.
    attach_blog_interface_events();

    //Get a new unique identifier for the post.
    get_new_post_id();
  }
}