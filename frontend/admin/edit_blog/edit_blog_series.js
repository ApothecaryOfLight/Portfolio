"use strict";


/*
Function to get a list of blog series.
*/
function get_series_list() {
  //Request the root blog posts from the server.
  const roots_request = new Request (
    ip + "get_series_list"
  );
  fetch( roots_request )
    .then( response => response.json() )
    .then( json => {
      //Render the list of blog series.
      compose_series_list( json.series_list );
    });
}


/*
Function to render the blog series drop down menu.

series: Object containing the series list.
*/
function compose_series_list( series_list ) {
  //Create a string containing the HTML to render the dropdown selector for
  //root posts.
  let dom_string = "<option value=\'-1\'>New Series</option>" +
    "<option value=\'-2\'>No Series</option>";

  //Iterate through every blog post in the root blog posts object.
  for( const index in series_list ) {
    dom_string += "<option value=\'";
    dom_string += series_list[index].series_id + "\'>";
    dom_string += series_list[index].series_title + "</option>";
  }

  //Get a reference to the root blog post dropdown selector.
  const dropdown = document.getElementById("blog_series_dropdown");

  //Set the HTML content of the dropdown selector to the HTML string.
  dropdown.innerHTML = dom_string;
  dropdown.value = -2;
}


function select_blog_series() {
  //Get a reference to the blog series dropdown selector.
  const select_series_dropdown = document.getElementById("blog_series_dropdown");

  //Get the currently selected value from the dropdown selector.
  const series_id = select_series_dropdown.value;
  
  const series_title_field = document.getElementById("blog_series_title_prompt_contianer");
  if( series_id >= 0 ) {
    //If there is a positive value for series_id, that means we're editing an
    //existing series.

    //Hide the new series title text field.
    series_title_field.style.display = "none";

    //Request a list of blog posts in this series from the server.
    get_blog_posts_by_series_id( series_id );
  } else if( series_id == -1 ) {
    //If the series_id is -1, that means we're working with a new series.
    series_title_field.style.display = "block";
  } else if( series_id == -2 ) {
    //If the series_id is -2, that means we're working with posts that don't
    //belong to any series.
    series_title_field.style.display = "none";
  }
}


/*
Function to get a unique identifier for a new blog post.
*/
function get_new_series_id( blog_edit_data ) {
  //Create a request of the server to get a new unique identifier.
  const new_id_request = new Request(
    ip + "new_series_id"
  );
  fetch( new_id_request )
    .then( response => response.json() )
    .then( json => {
      blog_edit_data.post_id = json.new_post_id;
      blog_edit_data.series_id = json.new_series_id;
    });
}


/*
Function to release a unique identifier for a new blog post if the post is
discarded.

inPostID: ID of the post that was discarded.
*/
function release_series_id( inSeriesID ) {
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