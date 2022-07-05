"use strict";


/*
Function to launch the portfolio.
*/
function launch_portfolio() {
  detach_sidebar_events();
  
  //Get references to the portfolio and blog interfaces.
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");

  //Hide the blog interface, show the portfolio interface.
  blog.style.display = "none";
  portfolio.style.display = "flex";

  //Get the portfolio from the server.
  window.scroll({ top: 0, behavior: 'smooth' });
  get_dynamic_portfolio();
  
}