"use strict";


/*
Function to get blog posts.
*/
function get_existing_posts() {
  //Create a request for the server for a list of existing blog posts.
  const series_dropdown_ref = document.getElementById("blog_series_dropdown");
  const series_id = series_dropdown_ref.value;
  const existing_request = new Request (
    ip + "get_existing_posts/" + series_id
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
  const dropdown = document.getElementById("blog_post_dropdown");

  //Assign the HTML string to the dropdown selector.
  dropdown.innerHTML = dom_string;
}


/*
Function to request an existing blog post from the server.

inPostID: Unique identifier of the post to fetch from the server.
*/
function load_blog_post( inPostID, inSeriesID ) {
  //Request the existing blog post from the server.
  const existing_request = new Request (
    ip + "get_blog_post/" + inPostID
  );
  fetch( existing_request )
    .then( response => response.json() )
    .then( json => {
      //Reset the input fields.
      blank_fields( inSeriesID, inPostID );

      //Render the blog post in the input fields.
      render_blog_post( json.post_data, json.images );
    });
}


/*
Function to create a new blog post.
*/
function select_blog_post( edit_blog_post ) {
  blank_input();
  
  //Get a reference to the root blog post dropdown selector.
  const edit_post_dropdown = document.getElementById("blog_post_dropdown");

  //Get the currently selected value from the dropdown selector.
  const edit_post_id = edit_post_dropdown.value;

  //Get a reference to the blog series dropdown selector.
  const select_series_dropdown = document.getElementById("blog_series_dropdown");

  //Get the currently selected value from the dropdown selector.
  const series_id = select_series_dropdown.value;

  if( edit_post_id != -1 ) {
    //If the edit post id is not -1, then we're editing an old post.

    //Load the selected post by ID.
    load_blog_post( edit_post_id, series_id );

    edit_blog_post.post_id = edit_post_id;
    edit_blog_post.series_id = series_id;
  } else {
    //Otherwise, if the edit post id is -1, that means we're creating a new post.

    //Reset the input fields.
    blank_fields( series_id );

    edit_blog_post.post_id = -1;
    edit_blog_post.series_id = series_id;
  }
}


/*
Function to get a unique identifier for a new blog post.
*/
function get_new_post_id( edit_blog_post ) {
  //Create a request of the server to get a new unique identifier.
  const new_id_request = new Request(
    ip + "new_id"
  );
  fetch( new_id_request )
    .then( response => response.json() )
    .then( json => {
      //Get a reference to the blog series dropdown selector.
      const select_series_dropdown = document.getElementById("blog_series_dropdown");

      //Get the currently selected value from the dropdown selector.
      const series_id = select_series_dropdown.value;

      edit_blog_post.post_id = json.new_post_id;
      edit_blog_post.series_id = series_id;
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