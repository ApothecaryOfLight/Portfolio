function launch_blog() {
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");
  portfolio.style.display = "none";
  blog.style.display = "block";

  get_blog_page( 1 );
}

async function get_blog_page( inPage ) {
  console.log( "fetching blog page." );
  const get_blog_request = new Request(
    ip + 'get_blog_page/' + inPage );
  fetch( get_blog_request )
    .then( response => response.json() )
    .then( json => {
      render_blog( json.blog_posts );
    });
}

function render_blog( blog_data ) {
console.dir( blog_data );
  const blog = document.getElementById("blog_interface");
  const recent_posts = blog_data.recent_posts;
  //1) Compose the most recent blog posts.
  let recent_posts_dom = "";
  for( index in recent_posts ) {
console.dir( recent_posts[index] );
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

function compose_blog_post( blog_post_data ) {

}

function compose_pagination_bar( blog_data ) {

}
