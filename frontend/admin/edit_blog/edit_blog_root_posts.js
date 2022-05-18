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
  console.log("compose_series_list");
  //Create a string containing the HTML to render the dropdown selector for
  //root posts.
  let dom_string = "<option value=\'-1\'>New Series</option>";

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
}


function select_blog_series() {
  //Get a reference to the blog series dropdown selector.
  const select_series_dropdown = document.getElementById("blog_series_dropdown");

  //Get the currently selected value from the dropdown selector.
  const series_id = select_series_dropdown.value;
  
  //Request a list of blog posts in this series from the server.
  get_blog_posts_by_series_id( series_id );
}