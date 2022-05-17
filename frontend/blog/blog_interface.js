"use strict";


/*
Function to launch the blog interface.
*/
function launch_blog() {
  //Get references to the portfolio and blog interfaces.
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");

  //Show the blog interface, hide the portfolio interface.
  portfolio.style.display = "none";
  blog.style.display = "flex";

  //Request the first blog page from the server.
  get_blog_page( 1 );
}