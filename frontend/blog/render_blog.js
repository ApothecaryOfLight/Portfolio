"use strict";


function render_blog( recent_posts ) {
  const starburst_ref = document.getElementById("blog_starburst_container");
  starburst_ref.style.display = "none";

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

        new_image.src = image_ref.image_data;
        new_image.classList = "blog_image";
        myBlogContainer.appendChild( new_image );
      }
    }
  })
 
}