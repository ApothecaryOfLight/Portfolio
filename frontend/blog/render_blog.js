"use strict";


/*
Function to render a blog post.

blog_data: Blog data to render.
*/
/*function render_blog( blog_data ) {
  //Process the blog text, inserting images into the text body.
  emplace_images( blog_data );

  //Get the blog page count in order to draw the page buttons.
  get_blog_page_count();

  //Get a reference to the blog post conatiner.
  const blog = document.getElementById("blog_interface_recent_post_container");

  //Set the contents of the blog post container to the posts stored in the object.
  const recent_posts = blog_data.recent_posts;

  //Create a string to store the HTML of the blog posts.
  let recent_posts_dom = "";

  //Iterate through each blog post.
  for( const index in recent_posts ) {
    //Get a timestamp and convert it into Human readable format.
    const js_date = new Date( recent_posts[index].timestamp );
    const datestring = js_date.toLocaleDateString();
    const timestring = js_date.toLocaleTimeString();

    //Make the text Human readable.
    const body_text = process_blog_text_body(
      recent_posts[index].body
    );

    //Convert the blog data into HTML.
    recent_posts_dom += "<div class=\'recent_blog_post\'>";

    recent_posts_dom += "<div class=\'recent_blog_header\'>";

    recent_posts_dom += "<div class=\'recent_blog_title\'>";
    recent_posts_dom += recent_posts[index].title;
    recent_posts_dom += "</div>";

    recent_posts_dom += "<div class=\'recent_blog_timestamp\'>";
    recent_posts_dom += datestring + " " + timestring;
    recent_posts_dom += "</div>";

    recent_posts_dom += "</div>";

    recent_posts_dom += "<div class=\'recent_blog_body\'>";
    recent_posts_dom += body_text;
    recent_posts_dom += "</div>";

    recent_posts_dom += "</div>";
  }

  //Set the blog post contents to the HTML string we created.
  blog.innerHTML = recent_posts_dom;
}*/

/*
Function to apply regex to outgoing text, replacing SQL sensitive characters with
HTML character codes.
*/
function process_outgoing_text( inText ) {
  let processed_text = inText.replace(
    /\'/g,
    "&#39;"
  );
  processed_text = processed_text.replace(
    /\"/g,
    "&#34;"
  );
  processed_text = processed_text.replace(
    /\\/g,
    "&#92;"
  );
  processed_text = processed_text.replace(
    /\//g,
    "&#47;"
  );
  processed_text = processed_text.replace(
    /[\r\n\b]/g,
    "<br>"
  );
  return processed_text;
}


/*
Function to apply regex to incoming text, replacing SQL HTML character codes with
sensitive characters.
*/
function process_incoming_text( inText ) {
  let processed_text = inText.replace(
    /&#39;/g,
    "\'"
  );
  processed_text = processed_text.replace(
    /&#34;/g,
    "\""
  );
  processed_text = processed_text.replace(
    /&#92;/g,
    "\\"
  );
  processed_text = processed_text.replace(
    /&#47;/g,
    "\/"
  );
  processed_text = processed_text.replace(
    /<br>/g,
    "\n"
  );
  return processed_text;
}


function get_image_ref( image_id, images ) {
  console.log( "imgid: " + image_id );
  for( let i=0; i<images.length; i++ ) {
    console.log( "image_id: " + image_id + " vs images: " + images[i].image_id );
    if( image_id == images[i].image_id ) {
      console.log( "WHAT THE FUCK" );
      return images[i];
    }
  }
}

function render_blog( recent_posts ) {
  console.dir( recent_posts );
  const myBlogContainer = document.getElementById("blog_interface_recent_post_container");
  recent_posts.posts.forEach( (post) => {  
    const blog_post_object = JSON.parse( process_incoming_text( post.body ) );
    for( const key in blog_post_object ) {
      const section_reference = blog_post_object[key];
      if( section_reference.type == "text" ) {
        const new_paragraph = document.createElement("p");
        new_paragraph.textContent = section_reference.content;
        myBlogContainer.appendChild( new_paragraph );
      } else if( section_reference.type == "image" ) {
        const new_image = document.createElement("img");
        const image_ref = get_image_ref( section_reference.image_id, recent_posts.images );
        console.dir( image_ref );

        new_image.src = image_ref.image_data;
        new_image.classList = "blog_image";
        myBlogContainer.appendChild( new_image );
      }
    }
  })
 
}