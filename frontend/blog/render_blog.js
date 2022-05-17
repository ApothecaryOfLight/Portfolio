"use strict";


/*
Function to render a blog post.

blog_data: Blog data to render.
*/
function render_blog( blog_data ) {
  //Process the blog text, inserting images into the text body.
  emplace_images( blog_data );

  //Get the blog page count in order to draw the page buttons.
  get_blog_page_count();

  //Get a reference to the blog post conatiner.
  const blog =
    document.getElementById("blog_interface_recent_post_container");

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
}