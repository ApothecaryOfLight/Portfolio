"use strict";


/*
Function to get portfolio entries from the server.
*/
function get_portfolio_entries( inDropdownValue ) {
    //Request a list of projects from the server.
    const get_portfolio_entries_request = new Request(
        ip + "get_portfolio_entries"
    );
    fetch( get_portfolio_entries_request )
        .then( response => response.json() )
        .then( json => {
            //Render the project dropdown selector's contents.
            compose_portfolio_entries(
                json.portfolio_entries,
                inDropdownValue
            );
        });
}