function launch_blog() {
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");
  portfolio.style.display = "none";
  blog.style.display = "flex";

  get_blog_page( 1 );
}

async function get_blog_page( inPage ) {
  const get_blog_request = new Request(
    ip + 'get_blog_page/' + inPage );
  fetch( get_blog_request )
    .then( response => response.json() )
    .then( json => {
      render_blog( json.blog_posts );
    });
}

function render_blog( blog_data ) {
  get_blog_page_count();

  const blog =
    document.getElementById("blog_interface_recent_post_container");
  const recent_posts = blog_data.recent_posts;
  //1) Compose the most recent blog posts.
  let recent_posts_dom = "";
  for( index in recent_posts ) {
    recent_posts_dom += "<div class=\'recent_blog_post\'>";

    recent_posts_dom += "<div class=\'recent_blog_header\'>";

    recent_posts_dom += "<div class=\'recent_blog_title\'>";
    recent_posts_dom += recent_posts[index].title;
    recent_posts_dom += "</div>";

    recent_posts_dom += "<div class=\'recent_blog_timestamp\'>";
    recent_posts_dom += recent_posts[index].timestamp;
    recent_posts_dom += "</div>";

    recent_posts_dom += "</div>";

    recent_posts_dom += "<div class=\'recent_blog_body\'>";
    recent_posts_dom += recent_posts[index].body;
    recent_posts_dom += "</div>";

    recent_posts_dom += "</div>";
  }

  //2) Compose a paginated list of primary blog topics.

  blog.innerHTML = recent_posts_dom;
}

/*Pagination*/
async function get_blog_page_count() {
  const get_blog_page_request = new Request(
    ip + "page_count"
  );
  console.log( "get_blog_page_count()" );
  fetch( get_blog_page_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        console.dir( json );
        render_blog_pagination( json.post_count );
      } else {
        console.error( json.reason );
      }
    });
}

function render_blog_pagination( inPostCount ) {
  const blog_pagination_container =
    document.getElementById("blog_interface_pagination_container");
  const page_count = Math.ceil( (inPostCount - 5)/8 );
  console.log( page_count );
  let page_buttons = "";
  for( i=1; i<=page_count; i++ ) {
    page_buttons += "<div class=\'page_button\'>" +
      i + "</div>";
  }
  console.log( page_buttons );
  blog_pagination_container.innerHTML = page_buttons;
}

function compose_blog_post( blog_post_data ) {

}
