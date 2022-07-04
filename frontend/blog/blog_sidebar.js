function attach_sidebar_events() {
    const sidebar_button_expand_ref = document.getElementById("blog_sidebar_container_button_expand");
    sidebar_button_expand_ref.addEventListener('click',blog_sidebar_expand_button);
    
    const sidebar_button_collapse_ref = document.getElementById("blog_sidebar_container_button_collapse");
    sidebar_button_collapse_ref.addEventListener('click',blog_sidebar_collapse_button);
}

function blog_sidebar_expand_button() {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    blog_sidebar_ref.style["width"] = "15rem";
    blog_sidebar_ref.style["border"] = "solid 0.15rem";

    const blog_sidebar_container_posts = document.getElementById("blog_sidebar_container_posts");
    blog_sidebar_container_posts.style["display"] = "block";

    const blog_sidebar_container_button_expand = document.getElementById("blog_sidebar_container_button_expand");
    blog_sidebar_container_button_expand.style["display"] = "none";
    
    const blog_sidebar_container_button_collapse = document.getElementById("blog_sidebar_container_button_collapse");
    blog_sidebar_container_button_collapse.style["display"] = "block";
}

function blog_sidebar_collapse_button() {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    blog_sidebar_ref.style["width"] = "0rem";
    blog_sidebar_ref.style["border"] = "none";

    const blog_sidebar_container_posts = document.getElementById("blog_sidebar_container_posts");
    blog_sidebar_container_posts.style["display"] = "none";

    const blog_sidebar_container_button_expand = document.getElementById("blog_sidebar_container_button_expand");
    blog_sidebar_container_button_expand.style["display"] = "block";
    
    const blog_sidebar_container_button_collapse = document.getElementById("blog_sidebar_container_button_collapse");
    blog_sidebar_container_button_collapse.style["display"] = "none";
}

function render_posts_sidebar( inPostList ) {
    const mySidebarContainer = document.getElementById("blog_sidebar_container");
    const blog_sidebar_container_posts = document.getElementById("blog_sidebar_container_posts");

    //Remove existing page buttons, if any.
    while( blog_sidebar_container_posts.firstChild ) {
        blog_sidebar_container_posts.firstChild.remove();
    }

    const series_title_header = document.createElement("div");
    series_title_header.innerText = inPostList.series[0].series_title;
    series_title_header.classList = "sidebar_series_title_header";
    blog_sidebar_container_posts.appendChild( series_title_header );

    inPostList.series.forEach( (post_obj) => {
        const post = document.createElement("div");
        post.innerText = post_obj.title;
        post.classList = "sidebar_post_title";
        post.onclick = get_blog_post_by_id.bind( null, post_obj.post_id );
        blog_sidebar_container_posts.appendChild( post );
    });

    blog_sidebar_expand_button();
}

//Get from the server a list of posts that belong to a specified series.
function blog_sidebar_fetch_posts_by_series( inSeriesID ) {
    const get_blog_posts_by_series_request = new Request(
        ip + 'get_blog_series',
        {
            method: 'POST',
            body: JSON.stringify({
                series_id: inSeriesID
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    fetch( get_blog_posts_by_series_request )
      .then( response => response.json() )
      .then( json => {
        if( json.result == "success" ) {
          //Render this page.
          render_posts_sidebar( json.posts_by_series );
        } else {
          //Otherwise, log an error.
          console.log( "ERROR" );
          console.log( json.reason );
        }
      });
}

//Get from the server a list of series that exist.
function blog_sidebar_fetch_series_list() {

}