"use strict";


/*
Function to render portfolio entries.
*/
function compose_portfolio_entries( portfolio_entries, inDropdownValue ) {
    //Create a string to store the dropdown options as HTML.
    let dom_string = "<option value=\'-1\'>New Portfolio Entry</option>";

    //Iterate through every project.
    for( const index in portfolio_entries ) {
        //Convert this project into an HTML dropdown option.
        dom_string += "<option value=\'";
        dom_string += portfolio_entries[index].portfolio_entry_id;
        dom_string += "\'>";
        dom_string += portfolio_entries[index].portfolio_title;
        dom_string += "</option>";
    }

    //Get a reference to the dropdown element.
    const dropdown = document.getElementById("portfolio_dropdown");

    //Set the HTML content of the dropdown to the stringbashed HTML.
    dropdown.innerHTML = dom_string;

    if( !inDropdownValue ) {
        //If there isn't a provided value, set the dropdown to default.
        dropdown.value = -1;
    } else {
        //Otherwise, set the dropdown value to the specified inDropdownValue.
        dropdown.value = inDropdownValue;
    }
}



/*
Function to render a portfolio entry.
*/
function render_portfolio_entry( portfolioEntry ) {
    //Get references to the relevant elements.
    const title_field = document.getElementById("portfolio_title_field");
    const github_field = document.getElementById("portfolio_github_field");
    const live_page_field = document.getElementById("portfolio_live_page_field");
    const description_field = document.getElementById("portfolio_description_field");
    const flags_field = document.getElementById("portfolio_flags_field");

    //Set the text content of the elements to the project values.
    title_field.value = portfolioEntry.portfolio_title;
    github_field.value = portfolioEntry.github_link;
    live_page_field.value = portfolioEntry.live_page;
    description_field.value = portfolioEntry.portfolio_text;
    flags_field.value = portfolioEntry.portfolio_flags;
}


/*
Function to set portfolio fields to empty.
*/
function blank_portfolio_fields( inDropdownValue ) {
    //Get references to the input fields of the project editor.
    const title_field = document.getElementById("portfolio_title_field");
    const github_field = document.getElementById("portfolio_github_field");
    const live_page_field = document.getElementById("portfolio_live_page_field");
    const description_field = document.getElementById("portfolio_description_field");
    const flags_field = document.getElementById("portfolio_flags_field");

    //Set the text fields to blank.
    title_field.value = "";
    github_field.value = "";
    live_page_field.value = "";
    description_field.value = "";
    flags_field.value = "";

    //Delete every image in the portfolio_images array.
    while( portfolio_images.length > 0 ) {
        portfolio_images.pop();
    }

    //Get a reference to the portfolio images container.
    const portfolio_images_container = document.getElementById("portfolio_images_container");

    //Delete all elements held inside the portfolio images container.
    portfolio_images_container.innerHTML = "";

    //Get the available portfolio entries from the server.
    get_portfolio_entries( inDropdownValue );
}