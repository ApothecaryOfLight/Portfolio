/*
Function to launch the edit blog interface.
*/
function launch_edit_blog_interface() {
  //Attach event listeners.
  attach_blog_interface_events();

  //Render the edit blog interface itself.
  render_edit_blog_interface();
}


/*
Function to render the edit blog interface.
*/
function render_edit_blog_interface() {
  //Get a list of blog posts that are roots (first in a series).
  get_roots();

  //Get a list of blog posts that are not roots (not first in a series).
  get_existing_posts();

  //Empty available input fields.
  blank_fields();
}



/*
Set text and image fields to blank.
*/
function blank_fields() {
  //Get references to the input elements.
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");

  //Reset the input elements.
  title_field.value = "";
  root_field.value = "-1";
  body_field.value = "";

  //Empty the images array.
  while( images.length > 0 ) {
    images.pop();
  }

  //Get a reference to the image container.
  const image_container = document.getElementById("new_blog_images_container");

  //Blank the image container.
  image_container.innerHTML = "";
}



/*
Function to render a blog post.

post_data: Object containing the blog post to edit.
*/
function render_blog_post( post_data ) {
  //Get references to the input fields.
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");
  const dropdown = document.getElementById("new_blog_old_post");

  //Set the dropdown selector to this blog post.
  dropdown.value = post_data.post_id;

  //Regex the text of the title so it will be Human readable.
  title_field.value = process_incoming_text( post_data.title );

  //If this is a root post, set the root value of the dropdown selector.
  if( post_data.root_id != null ) {
    root_field.value = post_data.root_id;
  } else {
    //Otherwise, if it's not a root post, set the dropdown to a new root post.
    root_field.value = -1;
  }

  //Regex the text of the blog post so it will be Human readable.
  body_field.value = process_incoming_text( post_data.body );
}


/*
Function to delete a blog post.

inPostID: Unique identifier of the blog post itself.
*/
function delete_post( inPostID ) {
  //Ensure that a post ID is provided.
  if( inPostID ) {
    //Send a request to the server to delete this particular post.
    const delete_post = new Request(
      ip + "delete_post/" + inPostID
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
}


/*
Function to get a unique identifier for a new blog post.
*/
function get_new_post_id() {
  //Create a request of the server to get a new unique identifier.
  const new_id_request = new Request(
    ip + "new_id"
  );
  fetch( new_id_request )
    .then( response => response.json() )
    .then( json => {
      attach_blog_interface_events( json.new_post_id );
    });
}


/*
Function to release a unique identifier for a new blog post if the post is
discarded.

inPostID: ID of the post that was discarded.
*/
function release_post_id( inPostID ) {
  //Ensure that there is a Post ID provided.
  if( inPostID ) {
    //Create a request for the server to release a reserved unique identifier.
    const release_id_request = new Request(
      ip + "release_id/" + inPostID
    );
    fetch( release_id_request )
      .then( response => response.json() )
      .then( json => {
        console.log( "ID released." );
      });
  }
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
  for( index in images ) {
    ids.push( images[index].local_image_id );
  }

  //Find the first unique identifier that does not already exist.
  for( i=0; i<100; i++ ) {
    if( !ids.includes( i ) ) {
      return i;
    }
  }
}