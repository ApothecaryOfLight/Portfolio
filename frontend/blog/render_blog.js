"use strict";

function render_blog_post( post, images ) {
  const myBlogContainer = document.getElementById("blog_interface_recent_post_container");

   //Create a container for the blog post.
   const blog_post_container = document.createElement("div");
   blog_post_container.classList = "blog_post_container";

   //Create the header container for the blog post.
   const blog_post_header_container = document.createElement("div");
   blog_post_header_container.classList = "blog_post_header_container";
   blog_post_container.appendChild( blog_post_header_container );

   //Create the timestamp of the blog post.
   const blog_post_timestamp = document.createElement("div");
   blog_post_timestamp.classList = "blog_post_timestamp";
   blog_post_timestamp.textContent = post.timestamp;
   blog_post_header_container.appendChild( blog_post_timestamp );

   //Create the series title element of the blog.
   const blog_post_series_title = document.createElement("div");
   blog_post_series_title.classList = "blog_post_series_title";
   blog_post_series_title.textContent = post.series_title + ":";
   blog_post_series_title.onclick = blog_sidebar_fetch_posts_by_series.bind( null, post.series_id );
   blog_post_header_container.appendChild( blog_post_series_title );

   //Create the title element of the blog.
   const blog_post_title = document.createElement("div");
   blog_post_title.classList = "blog_post_title";
   blog_post_title.textContent = post.title;
   blog_post_header_container.appendChild( blog_post_title );

   const blog_post_object = JSON.parse( process_incoming_text( post.body ) );
   
   for( const key in blog_post_object ) {
     const section_reference = blog_post_object[key];
     if( section_reference.type == "text" ) {
       const new_paragraph = document.createElement("p");
       new_paragraph.textContent = section_reference.content;
       blog_post_container.appendChild( new_paragraph );
     } else if( section_reference.type == "image" ) {
       const image_container = document.createElement("div");
       image_container.classList = "blog_image_container";

       const new_image = document.createElement("img");
       const image_ref = get_image_ref( section_reference.image_id, images );

       new_image.src = image_ref.image_data;
       new_image.classList = "blog_image";
       image_container.appendChild( new_image );

       blog_post_container.appendChild( image_container );
     } else if( section_reference.type == "code" ) {
       const code_section = document.createElement("pre");
       code_section.classList = "blog_post_code_section";
       code_section.textContent = section_reference.content;
       blog_post_container.appendChild( code_section );

       const copy_code_button = document.createElement("div");
       copy_code_button.classList = "blog_post_code_section_copy_button";
       copy_code_button.textContent = "Copy";
       copy_code_button.onclick = () => {
         navigator.clipboard.writeText( section_reference.content );
       }
       code_section.appendChild( copy_code_button );
     }
   }

   myBlogContainer.appendChild( blog_post_container );
}

function clear_blog() {
  //) Get a reference to the blog post container, where the blog posts will be rendered.
  const myBlogContainer = document.getElementById("blog_interface_recent_post_container");

  while( myBlogContainer.firstChild ) {
    myBlogContainer.firstChild.remove();
  }
}

function render_blog( recent_posts ) {
  window.scroll({ top: 0, behavior: 'smooth' });

  //1) Get a reference to the loading graphic and hide it.
  const starburst_ref = document.getElementById("starburst_container");
  starburst_ref.style.display = "none";

  clear_blog();

  //3) Process each blog post.
  recent_posts.posts.forEach( (post) => {
    render_blog_post( post, recent_posts.images );
  })
}