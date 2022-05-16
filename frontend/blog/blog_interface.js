/*
Function to launch the blog interface.
*/
function launch_blog() {
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");
  portfolio.style.display = "none";
  blog.style.display = "flex";

  get_blog_page( 1 );
}


/*
Function to get a specific blog page.
*/
async function get_blog_page( inPage ) {
  const get_blog_request = new Request(
    ip + 'get_blog_page/' + inPage );
  fetch( get_blog_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        render_blog( json.blog_posts );
      } else {
        console.log( "ERROR" );
        console.log( json.reason );
      }
    });
}


/*
Function to run regex on blog text to sanitize it for the server.
*/
function process_blog_text_body( inBody ) {
  let newText = "<p>";
  newText += inBody.replace( /<br><br>|<br>/g, "</p><p>" );
  newText += "</p>";
  return newText;
}


/*
Function to render a blog post.
*/
function render_blog( blog_data ) {
  emplace_images( blog_data );
  get_blog_page_count();

  const blog =
    document.getElementById("blog_interface_recent_post_container");
  const recent_posts = blog_data.recent_posts;

  //1) Compose the most recent blog posts.
  let recent_posts_dom = "";
  for( index in recent_posts ) {
    const js_date = new Date( recent_posts[index].timestamp );
    const datestring = js_date.toLocaleDateString();
    const timestring = js_date.toLocaleTimeString();

    const body_text = process_blog_text_body(
      recent_posts[index].body
    );

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

  //2) Compose a paginated list of primary blog topics.

  blog.innerHTML = recent_posts_dom;
}


/*
Function to find an image tag in a blog post, for the purposes of emplacing images.
*/
function find_image_tag( inText ) {
  return inText.indexOf( "image[[[" );
}


/*
Function to get an image from the server.
*/
function get_image( blog_data, post_id, local_image_id ) {
  const ref = blog_data.recent_posts_images;
  for( indexB in ref ) {
    if( ref[indexB].local_image_id == local_image_id ) {
      if( ref[indexB].post_id == post_id ) {
        return ref[indexB].image_data;
      }
    }
  }
}


/*
Function to emplace images into a blog post.
*/
function emplace_images( blog_data ) {
  //1) Iterate through recent_posts.
  for( index in blog_data.recent_posts ) {
    const post_id = blog_data.recent_posts[index].post_id;
    let start_index =
      blog_data.recent_posts[index].body.indexOf( "[[[image=" );
    while( start_index != -1 ) {
      const end_index =
        blog_data.recent_posts[index].body.indexOf( "]]]" );
      const local_image_id_text =
        blog_data.recent_posts[index].body.substring(
          start_index+9,
          end_index
        );
      const local_image_id = Number( local_image_id_text );
      const first_half =
        blog_data.recent_posts[index].body.substr( 0, start_index );
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
      start_index =
        blog_data.recent_posts[index].body.indexOf( "[[[image=" );
    }
  }
}


/*
Function to get the number of pages in the blog.
*/
async function get_blog_page_count() {
  const get_blog_page_request = new Request(
    ip + "page_count"
  );
  fetch( get_blog_page_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        render_blog_pagination( json.post_count );
      } else {
        console.log( "ERROR" );
        console.error( json.reason );
      }
    });
}


/*
Function to render the blog page buttons.
*/
function render_blog_pagination( inPostCount ) {
  const blog_pagination_container =
    document.getElementById("blog_interface_pagination_container");
  const page_count = Math.ceil( (inPostCount - 5)/8 );
  let page_buttons = "";
  for( i=1; i<=page_count; i++ ) {
    page_buttons += "<div class=\'page_button\'>" +
      i + "</div>";
  }
  blog_pagination_container.innerHTML = page_buttons;
}