"use strict";


/*
Function to launch the edit blog interface.
*/
function launch_edit_blog_interface() {
  const blog_edit_data = {
    post_id: null,
    series_id: null
  };

  //Attach event listeners.
  attach_edit_blog_interface_events(blog_edit_data);

  //Render the edit blog interface itself.
  render_edit_blog_interface();
}


/*
Function to render the edit blog interface.
*/
function render_edit_blog_interface() {
  //Get a list of blog posts that are roots (first in a series).
  get_series_list();

  //Get a list of blog posts that are not roots (not first in a series).
  get_existing_posts();

  //Empty available input fields.
  blank_fields();
}


/*
Set text and image fields to blank.
*/
function blank_fields( inSeriesID ) {
  //Get references to the input elements.
  const series_field = document.getElementById("blog_series_dropdown");
  const title_field = document.getElementById("new_blog_title");
  const button_container = document.getElementById("button_container");

  //Reset the input elements.
  title_field.value = "";
  if( !inSeriesID ) {
    series_field.value = "-2";
  }

  while( button_container.nextSibling ) {
    button_container.nextSibling.remove();
  }

  blank_input();
}


function blank_input() {
  const body_field = document.getElementById("myInput");
  body_field.textContent = "";
}



/*
Function to render a blog post.

post_data: Object containing the blog post to edit.
*/
function render_blog_post( post_data, images ) {
  //Get references to the input fields.
  const title_field = document.getElementById("new_blog_title");
  //const body_field = document.getElementById("new_blog_body");
  const dropdown = document.getElementById("blog_post_dropdown");

  //Set the dropdown selector to this blog post.
  dropdown.value = post_data.post_id;

  //Regex the text of the title so it will be Human readable.
  title_field.value = process_incoming_text( post_data.title );

  render_blog_post_body( post_data.body, images );
}


function render_blog_post_body( body_string, images ) {
  //const body_object = JSON.parse( body_string );
  //Regex the text of the blog post so it will be Human readable.
  const myInput = document.getElementById("myInput");


  for( let index = 0; index < images.length; index ++ ) {
      add_visible_image_to_gallery( images[index].image_data, images[index].image_id )
  }

  let out_string = "";
  const blog_post_object = JSON.parse( process_incoming_text( body_string ) );
  for( const key in blog_post_object ) {
    const section_reference = blog_post_object[key];
    if( section_reference.type == "text" ) {
      const new_paragraph = document.createElement("p");
      new_paragraph.textContent = section_reference.content;
      myInput.appendChild( new_paragraph );
    } else if( section_reference.type == "image" ) {
      const new_image = document.createElement("img");
      new_image.src = images[section_reference.local_image_id].image_data;
      new_image.classList = "emplaced_image";
      new_image.setAttribute( "data-image_id", images[section_reference.local_image_id].image_id );
      myInput.appendChild( new_image );
    }
  }
}


/*
Function to delete a blog post.

inPostID: Unique identifier of the blog post itself.
*/
function delete_post() {
  const post_dropdown_ref = document.getElementById("blog_post_dropdown");
  const post_id = post_dropdown_ref.value;
  //Send a request to the server to delete this particular post.
  const delete_post = new Request(
    ip + "delete_post/" + post_id
  );
  fetch( delete_post )
    .then( response => response.json() )
    .then( json => {
      //Refresh the list of posts.
      get_existing_posts();

      //Reset the input fields.
      blank_fields();
    });
}


/*
Function to generate a temporary unique identifier for a blog image.

NB: This is terrible. Just terrible. There's no need to iterate over
all the values twice. The limit of 101 IDs is arbitrary and low. The
fact that the sets are compared with each other causes runtime to
grow exponentially as the number of issued IDs increases.

A simple unqiue identity generator would be much more efficient.

Not gonna lie, a little disappointed in myself here.
*/
function generate_temp_image_id() {
  //Create an array to store existing IDs.
  const ids = [];

  //Push every existing image ID into the ids array we created above.
  for( const index in images ) {
    ids.push( images[index].local_image_id );
  }

  //Find the first unique identifier that does not already exist.
  for( let new_id=0; new_id<100; new_id++ ) {
    if( !ids.includes( new_id ) ) {
      return new_id;
    }
  }
}


function get_blog_posts_by_series_id( series_id ) {
  //Request a list of blog posts with a specific series ID from the server.
  const request_blog_posts_by_series_id = new Request(
    ip + "get_blog_posts_by_series_id/" + series_id
  );
  fetch( request_blog_posts_by_series_id )
    .then( response => response.json() )
    .then( json => {
      blank_fields( series_id );
      compose_existing( json.existing );
    });
}