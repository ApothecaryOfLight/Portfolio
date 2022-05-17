"use strict";


/*
Function to get the number of pages in the blog.
*/
async function get_blog_page_count() {
  //Request the number of blog pages available from the server.
  const get_blog_page_request = new Request(
    ip + "page_count"
  );
  fetch( get_blog_page_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        //Render the page buttons.
        render_blog_pagination( json.post_count );
      } else {
        //Otherwise, log the error.
        console.log( "ERROR" );
        console.error( json.reason );
      }
    });
  }
  
  
/*
Function to render the blog page buttons.

inPostCount: Number of blog posts.
*/
function render_blog_pagination( inPostCount ) {
  //Get a reference to the blog page button container.
  const blog_pagination_container =
    document.getElementById("blog_interface_pagination_container");

  //Calculate the number of pages that should be available.
  const page_count = Math.ceil( (inPostCount - 5)/8 );

  //Create a string to store the HTML of the page buttons.
  let page_buttons = "";

  //Create a page button for each page that should be available.
  for( i=1; i<=page_count; i++ ) {
    page_buttons += "<div class=\'page_button\'>" +
      i + "</div>";
  }

  //Set the page button container's contents to the page buttons we string-bashed
  //together.
  blog_pagination_container.innerHTML = page_buttons;
}