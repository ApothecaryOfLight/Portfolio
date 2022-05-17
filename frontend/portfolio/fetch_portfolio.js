"use strict";


/*
Function to load the portfolio from the server.
*/
function get_dynamic_portfolio() {
  //Get a timestamp, to track how long retrieval takes.
  const req_time = Date.now();

  //Request the portfolio from the sever.
  const portfolio_request = new Request(
    ip + "get_portfolio"
  );
  fetch( portfolio_request )
    .then( response => response.json() )
    .then( json => {
      //Calculate how long the fetch took.
      const rec = Date.now();
      console.log( "Fetch took: " + (rec - req_time) + "ms" );

      //Render the portfolio.
      render_dynamic_portfolio(
        json.portfolio_data,
        json.portfolio_images,
        json.isDev
      );
    });
  }