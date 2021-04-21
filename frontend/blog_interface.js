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
      render_blog( json.blog_data );
    });
}

function render_blog( blog_data ) {
  //1) Compose the most recent blog posts.
  

  //2) Compose a paginated list of primary blog topics.
}

function compose_blog_post( blog_post_data ) {

}

function compose_pagination_bar( blog_data ) {

}
