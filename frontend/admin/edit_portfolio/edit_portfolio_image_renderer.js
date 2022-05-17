"use strict";


/*
Function to render the portfolio image gallery.
*/
function render_portfolio_image_gallery() {
    //Create a string to store the images transformed into HTML.
    let html_string = "";

    //Iterate through every image.
    for( const index in portfolio_images ) {
        //Convert this image into HTML and append it to the string, including the
        //delete button an associated divs.
        html_string += "<div class=\'portfolio_image_container\'>" +
            "<div class=\'portfolio_image_body\'>" +
            "<img class=\'portfolio_image_image\' " +
            "src=\'" + portfolio_images[index].image_data + "\'>" +
            "<div class=\'portfolio_image_tools\'>" +
            "<button class=\'portfolio_image_delete\' " +
            "onclick=\'delete_image_from_gallery(" +
            portfolio_images[index].image_id + ", " +
            portfolio_images[index].local_image_id +
            ");\'" +
            ">X</button>" +
            "</div>" +
            "</div></div>";
    }

    //Get a reference to the portfolio images container.
    const portfolio_images_container =
        document.getElementById("portfolio_images_container");

    //Assign the HTML string as the contents of the container.
    portfolio_images_container.innerHTML = html_string;
}