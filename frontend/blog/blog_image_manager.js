"use strict";


/*
Function to find an image tag in a blog post, for the purposes of emplacing images.

inText: Text to look for the image tag in.
*/
function find_image_tag( inText ) {
  return inText.indexOf( "image[[[" );
}
  
  
/*
Function to get image data by ID.

blog_data: Blog post to look for the image in.

post_id: Server issued ID to look for.

local_image_id: Locallly issued ID to loook for.
*/
function get_image( blog_data, post_id, local_image_id ) {
  //Get a reference to the blog post's images.
  const ref = blog_data.recent_posts_images;

  //Iterate through every image in this blog post.
  for( const indexB in ref ) {
    //If this image has the correct local ID, then:
    if( ref[indexB].local_image_id == local_image_id ) {
      //If this image has the correct server ID, then:
      if( ref[indexB].post_id == post_id ) {
        //Return this image's data.
        return ref[indexB].image_data;
      }
    }
  }
}
  
  
/*
Function to emplace images into a blog post.

blog_data: Blog post to emplace images in.
*/
function emplace_images( blog_data ) {
  //Iterate through recent_posts.
  for( const index in blog_data.recent_posts ) {
    const post_id = blog_data.recent_posts[index].post_id;
    let start_index = blog_data.recent_posts[index].body.indexOf( "[[[image=" );
    while( start_index != -1 ) {
      const end_index =
        blog_data.recent_posts[index].body.indexOf( "]]]" );
      const local_image_id_text =
        blog_data.recent_posts[index].body.substring(
          start_index+9,
          end_index
        );
      const local_image_id = Number( local_image_id_text );
      const first_half = blog_data.recent_posts[index].body.substr( 0, start_index );
      const second_half =
        blog_data.recent_posts[index].body.substr(
          end_index+3,
          blog_data.recent_posts[index].body.length
        );
      const image_data = get_image(
        blog_data,
        post_id,
        local_image_id
      );
      const image_string = "<div class=\'blog_image_container\'>" +
        "<img class=\'blog_image\' src=\'" +
        image_data +
        "\'>" +
        "</div>";
      const new_string = first_half + image_string + second_half;
      blog_data.recent_posts[index].body = new_string;
      start_index = blog_data.recent_posts[index].body.indexOf( "[[[image=" );
    }
  }
}