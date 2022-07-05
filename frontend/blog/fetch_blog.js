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
        get_blog_page_count();
        render_blog( json.blog_posts );
      } else {
        //Otherwise, log an error.
        console.log( "ERROR" );
        console.log( json.reason );
      }
    });
}


async function get_blog_post_by_id( inPostID ) {
  //Request a specific blog page from the server.
  const get_blog_request = new Request(
    ip + 'get_blog_post_by_id/' + inPostID );
  fetch( get_blog_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        //Render this page.
        clear_blog();
        clear_blog_pagination();
        render_blog_post( json.posts_by_series.blog_post[0], json.posts_by_series.blog_post_images );
        blog_sidebar_collapse_button();
      } else {
        //Otherwise, log an error.
        console.log( "ERROR" );
        console.log( json.reason );
      }
    });
}

async function get_series_list() {
  const get_blog_series_request = new Request(
    ip + 'get_blog_series_all' );
  fetch( get_blog_series_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        hide_blog_sidebar_back_to_all_series_button();
        render_blog_sidebar_series_list( json.series_list );
      } else {
        //Otherwise, log an error.
        console.log( "ERROR" );
        console.log( json.reason );
      }
    });
}