function launch_portfolio() {
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");
  blog.style.display = "none";
  portfolio.style.display = "block";

  get_dynamic_portfolio();
}

function get_dynamic_portfolio() {
  const portfolio_request = new Request(
    ip + "get_portfolio"
  );
  fetch( portfolio_request )
    .then( response => response.json() )
    .then( json => {
console.dir( json.portfolio_data );
      render_dynamic_portfolio(
        json.portfolio_data,
        json.portfolio_images
      );
    });
}

function render_dynamic_portfolio( portfolioData, image_data ) {
  let dynamic_portfolio_string;
  for( index in portfolioData ) {
    dynamic_portfolio_string +=
      compose_project( portfolioData[index], image_data );
  }
  const dynamic_portfolio_dom_element =
    document.getElementById("dynamic_project_container");
  dynamic_portfolio_dom_element.innerHTML =
    dynamic_portfolio_string;
}

function compose_project( projectData, imageData ) {
  const title = projectData.portfolio_title;
  let project_string = "<div class=\'project_container\'>" +
    "<div class=\'pictures_container\'>" +
    "<button id=\'" + title + "_pic_last\' " +
    "class=\'pic_last\'>\<</button>" +
    "<button id=\'" + title + "_pic_next\' " +
    "class=\'pic_next\'>\></button>" +
    "<div id=\'" + title + "_scroll\'" +
    " class=\'scroll\'" +
    ">";

  for( index in imageData ) {
    if(
      imageData[index].portfolio_entry_id ==
      projectData.portfolio_entry_id
    ) {
      project_string += "<img id=\'" + title + "\'" +
        " src=\'" + imageData[index].image_data + "\'" +
        " class=\'image\'/>";
    }
  }

  project_string += "</div></div>";

  project_string += "<div class=\'description_container\'>" +
    "<div class=\'title_text\'>" + title + "</div>";

  project_string += "<div class=\'github_link\'>" +
    "<a href=\'" +
    projectData.github_link + "\'>" +
    "Github Page" + "</a></div><br>";

  project_string += "<div class=\'live_link\'>" +
    "<a href=\'" +
    projectData.live_page + "\'>" +
    "Live Page</a></div><br>";

  project_string += "<div class=\'description_text\'>" +
    projectData.portfolio_text + "</div>";

  project_string += "<div class=\'icon_container\'>" +
    projectData.portfolio_flags + "</div>";

  project_string += "</div></div></div>";
  return project_string;
}
