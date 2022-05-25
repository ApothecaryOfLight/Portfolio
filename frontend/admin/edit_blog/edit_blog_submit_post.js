"use strict";


/*
Function to submit a blog post.
*/
function submit_post( blog_edit_data ) {
  //Get references to the text field DOM elements.
  const series_id_field = document.getElementById("blog_series_dropdown");
  const series_title_field = document.getElementById("blog_series_title");
  const post_title_field = document.getElementById("new_blog_title");
  const body_field = document.getElementById("new_blog_body");

  //Get the text value of the text fields.
  const series_id = series_id_field.value;
  const series_title = series_title_field.value;
  const post_title = post_title_field.value;
  const body_text = body_field.value;

  //Get a reference to the blog post dropdown selector.
  const edit_post_dropdown = document.getElementById("blog_post_dropdown");

  //Get the currently selected blog post from the dropdown selector.
  const edit_post_id = edit_post_dropdown.value;

  //If this is a new blog post, then the ID will be -1.
  if( edit_post_id  == -1 ) {
    //Create an object that contains the new blog post.
    const new_post_object = {
      "series_id": series_id,
      "series_title": process_outgoing_text( series_title ),
      "post_title": process_outgoing_text( post_title ),
      "body": process_outgoing_text( body_text ),
      "postorder": "???",
      "password_hash": "???",
      "images": images
    };
    
    //Send the new blog post to the server.
    const new_post_request = new Request(
      ip + 'new_blog_post',
      {
        method: "POST",
        body: JSON.stringify( new_post_object ),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    fetch( new_post_request )
      .then( response => response.json() )
      .then( json => {
        render_edit_blog_interface();
      });
  } else {
    //Otherwise, this is an update to an existing blog post: AKA an edit.
    //Create an object containing the edited blog post, and send it to the
    //server.
    const edit_post_object = JSON.stringify({
      "post_id": edit_post_id,
      "title": process_outgoing_text( title_text ),
      "body": process_outgoing_text( body_text ),
      "root": root_id,
      "postorder": "???",
      "password_hash": "???",
      "images": images
    });
    const edit_post_request = new Request(
      ip + 'edit_blog_post',
      {
        method: "POST",
        body: edit_post_object,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    fetch( edit_post_request )
      .then( response => response.json() )
      .then( json => {
        //Rerender the edit blog interface, resetting all the input fields.
        render_edit_blog_interface();
      });
  }
}