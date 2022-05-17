"use strict";


/*
Function to render the portfolio.

portfolioData: The data of all the projects.

image_data: The image data of all images.

isDev: Boolean that will be used to distinguish between dev and prod project links.
*/
function render_dynamic_portfolio( portfolioData, image_data, isDev ) {
  //Create a string to store the projects as HTML.
  let dynamic_portfolio_string = "";

  //Iterate through each project.
  for( const index in portfolioData ) {
    //Add this project as HTML to the string.
    dynamic_portfolio_string +=
      compose_project( portfolioData[index], image_data, isDev );
  }

  //Get a reference to the portfolio container.
  const dynamic_portfolio_dom_element =
    document.getElementById("dynamic_project_container");

  //Set the contents of the portoflio container to the HTML string.
  dynamic_portfolio_dom_element.innerHTML =
    dynamic_portfolio_string;

  //Attach scroll buttons to the image galleries.
  attach_scroll_buttons( portfolioData, image_data );
}


/*
Function to determine if there is only 1 image for the gallery.

imageData: Images provided for this project.

id: Unique project identifier.
*/
function has_multiple_images( imageData, id ) {
  //Variable to count how many images this project has.
  let counter = 0;

  //Iterate through every image.
  for( const index in imageData ) {
    //If this image belongs to this project, increment the counter.
    if( imageData[index].portfolio_entry_id == id ) {
      counter++;
    }
  }

  //If the counter is greater than 1:
  if( counter > 1 ) {
    //Return true, signifying that there are multiple images in this project.
    return true;
  } else {
    //Return false, signifying that there is only 1 image in this project.
    return false;
  }
}


/*
Function to render an individual project.

projectData: Object conatining the data for this project.

imageData: Object containing the images.

isDev: Boolean dictating whether dev or prod links should be used.
*/
function compose_project( projectData, imageData, isDev ) {
  //Get the title of this project.
  const title = projectData.portfolio_title;

  //Create a string to store the project as HTML.
  let project_string = "<div class=\'project_container\'>" +
    "<div class=\'pictures_container\' " +
    "style=\'width:640px\'" +
    ">";

  //Get this project's ID.
  const id = projectData.portfolio_entry_id;

  //If this project has multiple images, compose scroll buttons for its image gallery.
  if( has_multiple_images( imageData, id ) ) {
    project_string += "<button id=\'" + title + "_pic_last\' " +
      "class=\'pic_last\'>\<</button>"  +
      "<button id=\'" + title + "_pic_next\' " +
      "class=\'pic_next\'>\></button>";
  }

  //Add the scroll buttons to the image gallery.
  project_string += "<div id=\'" + title + "_scroll\'" +
    " class=\'scroll\'" +
    ">";

  //Create a counter to set the number in the name of each image.
  let counter = 0;
  //Iterate through each image.
  for( const index in imageData ) {
    //If this image is a part of this project, then:
    if(
      imageData[index].portfolio_entry_id ==
      projectData.portfolio_entry_id
    ) {
      //Add this image to the HTML string, naming it by combining the project title
      //with the value of the counter for this iteration.
      project_string += "<img id=\'" +
        title + "_" + counter +
        "\'" +
        " src=\'" + imageData[index].image_data + "\'" +
        " class=\'image\'/>";
      counter++;
    }
  }

  project_string += "</div></div>";

  project_string += "<div class=\'description_container\'>" +
    "<div class=\'title_text\'>" + title + "</div>";

  project_string += "<div class=\'github_link\'>" +
    "<a href=\'" +
    projectData.github_link + "\'>" +
    "Github Page" + "</a></div><br>";

  //Test whether this is a dev or prod deployment.
  if( !isDev ) {
    //If it is prod, use the live page as the link.
    project_string += "<div class=\'live_link\'>" +
      "<a href=\'" +
      projectData.live_page + "\'>" +
      "Live Page</a></div><br>";
  } else {
    //If it is dev, use the dev page as the link.
    project_string += "<div class=\'live_link\'>" +
      "<a href=\'" +
      ip.substring(0, ip.length-6) + "/" + projectData.dev_page + "\'>" +
      "Dev Page</a></div></br>";
  }

  project_string += "<div class=\'description_text\'>" +
    projectData.portfolio_text + "</div>";

  project_string += "<div class=\'icon_container\'>" +
    projectData.portfolio_flags + "</div>";

  project_string += "</div></div></div>";

  //Return the HTMLified project to be rendered.
  return project_string;
}