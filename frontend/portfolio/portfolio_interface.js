/*
Function to launch the portfolio.
*/
function launch_portfolio() {
  //Get references to the portfolio and blog interfaces.
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");

  //Hide the blog interface, show the portfolio interface.
  blog.style.display = "none";
  portfolio.style.display = "block";

  //Get the portfolio from the server.
  get_dynamic_portfolio();
}