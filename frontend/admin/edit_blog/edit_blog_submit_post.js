"use strict";


function recursively_traverse_tree( node, objectified_post, images_array ) {
  if( node.firstChild ) {
      for( const key in node.childNodes ) {
          recursively_traverse_tree( node.childNodes[key], objectified_post, images_array );
      }
  } else {
      const type = node.nodeName;

      if( type == "#text" || type == "DIV" ) {
        if( node.textContent ) {
          let node_type = "text";
          if( node.parentElement.nodeName == "PRE" ) {
            node_type = "code";
          }
          objectified_post.push({
              type: node_type,
              content: node.textContent
          });
        }
        return;
      } else if( type == "IMG" ) {
        const image_id = node.getAttribute( "data-image_id" );
        const local_image_id = images_array.length;
        const post_section = objectified_post.length;
        objectified_post.push({
            type: "image",
            image_id: image_id,
            local_image_id: local_image_id,
            post_section: post_section
        });

        images_array[local_image_id] = {
          image_id: image_id,
          image_data: node.src,
          local_image_id: local_image_id,
          post_section: post_section,
          name: "image name",
          alt: "alt desc"
        }
        return;
      }   
  }
}


/*
Function to submit a blog post.
*/
function submit_post( blog_edit_data ) {
  //Get references to the text field DOM elements.
  const series_id_field = document.getElementById("blog_series_dropdown");
  const series_title_field = document.getElementById("blog_series_title");

  const post_id_field = document.getElementById("blog_post_dropdown");
  const post_title_field = document.getElementById("new_blog_title");

  //Process the blog post itself into a object to send to the server.
  const objectified_post = [];
  const images_array = [];
  const myInput = document.getElementById("myInput");
  recursively_traverse_tree( myInput, objectified_post, images_array );
  const stringified_object = JSON.stringify( objectified_post );

  //Get the text and id values of the series and post fields.
  const series_id = series_id_field.value;
  const post_id = post_id_field.value;
  const post_title = post_title_field.value;
  const series_title = series_title_field.value;


  const new_post_object = {
    series_id: series_id,
    post_id: post_id,
    series_title: process_outgoing_text( series_title ),
    post_title: process_outgoing_text( post_title ),
    body: process_outgoing_text( stringified_object ),
    images: images_array
  };

  //If this is a new blog post, then the ID will be -1.
  if( post_id == -1 ) {
    //Create an object that contains the new blog post.
    const new_post_object = {
      "series_id": series_id,
      "series_title": process_outgoing_text( series_title ),
      "post_title": process_outgoing_text( post_title ),
      "body": process_outgoing_text( stringified_object ),
      "postorder": "???",
      "password_hash": "???",
      "images": images_array
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
      "series_id": series_id,
      "series_title": process_outgoing_text( series_title ),
      "post_id": post_id,
      "post_title": process_outgoing_text( post_title ),
      "body": process_outgoing_text( stringified_object ),
      "postorder": "???",
      "password_hash": "???",
      "images": images_array
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
        if( json.result == "failure" ) {
          alert( "Server error!" );
        }
      });
  }
}