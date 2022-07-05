function attach_sidebar_events() {
    const sidebar_button_expand_ref = document.getElementById("blog_sidebar_container_button_expand");
    sidebar_button_expand_ref.addEventListener('click',blog_sidebar_expand_button);
    
    const sidebar_button_collapse_ref = document.getElementById("blog_sidebar_container_button_collapse");
    sidebar_button_collapse_ref.addEventListener('click',blog_sidebar_collapse_button);
    
    const blog_sidebar_container_back_to_series_button = document.getElementById("blog_sidebar_container_back_to_series_button");
    blog_sidebar_container_back_to_series_button.addEventListener('click',get_series_list);

    const blog_sidebar_container = document.getElementById("blog_sidebar_container");
    blog_sidebar_container.ontransitionend = blog_sidebar_transitionend;

    get_series_list();
}

function detach_sidebar_events() {
    const sidebar_button_expand_ref = document.getElementById("blog_sidebar_container_button_expand");
    sidebar_button_expand_ref.removeEventListener('click',blog_sidebar_expand_button);
    
    const sidebar_button_collapse_ref = document.getElementById("blog_sidebar_container_button_collapse");
    sidebar_button_collapse_ref.removeEventListener('click',blog_sidebar_collapse_button);
    
    const blog_sidebar_container_back_to_series_button = document.getElementById("blog_sidebar_container_back_to_series_button");
    blog_sidebar_container_back_to_series_button.removeEventListener('click',get_series_list);

    const blog_sidebar_container = document.getElementById("blog_sidebar_container");
    blog_sidebar_container.ontransitionend = null;
}

function blog_sidebar_transitionend( transitionEvent ) {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    if( transitionEvent.target.style["width"] == "0rem" ) {
        blog_sidebar_ref.style["border-color"] = "white";
    } else {
        blog_sidebar_ref.style["border-color"] = "black";
    }
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
    blog_sidebar_container_button_collapse.style["display"] = "flex";
}

function blog_sidebar_collapse_button() {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    blog_sidebar_ref.style["width"] = "0rem";

    const blog_sidebar_container_button_expand = document.getElementById("blog_sidebar_container_button_expand");
    blog_sidebar_container_button_expand.style["display"] = "flex";
    
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
    series_title_header.innerText = "Series: " + inPostList.series[0].series_title;
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
          show_blog_sidebar_back_to_all_series_button();
          render_posts_sidebar( json.posts_by_series );
        } else {
          //Otherwise, log an error.
          console.log( "ERROR" );
          console.log( json.reason );
        }
      });
}


function render_blog_sidebar_series_list( inSeriesList ) {
    const blog_sidebar_container_posts = document.getElementById("blog_sidebar_container_posts");

    //Remove existing page buttons, if any.
    while( blog_sidebar_container_posts.firstChild ) {
        blog_sidebar_container_posts.firstChild.remove();
    }

    const series_title_header = document.createElement("div");
    series_title_header.innerText = "All Series";
    series_title_header.classList = "sidebar_all_series_title_header";
    blog_sidebar_container_posts.appendChild( series_title_header );

    inSeriesList.forEach( (series) => {
        const series_title = document.createElement("div");
        series_title.innerText = series.series_title;
        series_title.classList = "sidebar_post_title";
        series_title.onclick = blog_sidebar_fetch_posts_by_series.bind( null, series.series_id );
        blog_sidebar_container_posts.appendChild( series_title );
    })
}

function show_blog_sidebar_back_to_all_series_button() {
    const back_to_all_series_button = document.getElementById("blog_sidebar_container_back_to_series_button");
    back_to_all_series_button.style["display"] = "flex";
}

function hide_blog_sidebar_back_to_all_series_button() {
    const back_to_all_series_button = document.getElementById("blog_sidebar_container_back_to_series_button");
    back_to_all_series_button.style["display"] = "none";
}