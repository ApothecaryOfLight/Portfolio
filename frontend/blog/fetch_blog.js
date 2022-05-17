"use strict";


/*
Function to get a specific blog page.

inPage: Page to request from the server.
*/
async function get_blog_page( inPage ) {
  //Request a specific blog page from the server.
  const get_blog_request = new Request(
    ip + 'get_blog_page/' + inPage );
  fetch( get_blog_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        //Render this page.
        render_blog( json.blog_posts );
      } else {
        //Otherwise, log an error.
        console.log( "ERROR" );
        console.log( json.reason );
      }
    });
}