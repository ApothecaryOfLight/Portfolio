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

    const blog_sidebar_container_button_expand = document.getElementById("blog_sidebar_container_button_expand");
    blog_sidebar_container_button_expand.style["display"] = "none";
    
    const blog_sidebar_container_button_collapse = document.getElementById("blog_sidebar_container_button_collapse");
    blog_sidebar_container_button_collapse.style["display"] = "block";
}

function blog_sidebar_collapse_button() {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    blog_sidebar_ref.style["width"] = "0rem";
    blog_sidebar_ref.style["border"] = "none";

    const blog_sidebar_container_button_expand = document.getElementById("blog_sidebar_container_button_expand");
    blog_sidebar_container_button_expand.style["display"] = "block";
    
    const blog_sidebar_container_button_collapse = document.getElementById("blog_sidebar_container_button_collapse");
    blog_sidebar_container_button_collapse.style["display"] = "none";
}