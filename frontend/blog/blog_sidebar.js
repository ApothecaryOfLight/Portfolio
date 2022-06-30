function attach_sidebar_events() {
    const sidebar_button_expand_ref = document.getElementById("blog_sidebar_container_button_expand");
    sidebar_button_expand_ref.addEventListener('click',blog_sidebar_expand_button);
}

function blog_sidebar_expand_button() {
    const blog_sidebar_ref = document.getElementById("blog_sidebar_container");
    blog_sidebar_ref.style["width"] = "15rem";
}

function blog_sidebar_collapse_button() {

}