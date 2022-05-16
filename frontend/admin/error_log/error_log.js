"use strict";


/*
Gets error log from server.
*/
function get_errors() {
    //Create the request and fetch it from the server.
    const get_errors_request = new Request(
      ip + 'get_errors'
    );
    fetch( get_errors_request )
      .then( json => json.json() )
      .then( json => {
        //Get a reference to the error log container.
        const dom_handle = document.getElementById("error_log_container");
        let dom_text = "<table rules=\'all\' style=\'border:1px solid;\'>" +
          "<tr>" +
            "<th>Timestamp</th>" +
            "<th>Severity</th>" +
            "<th>Source</th>" +
            "<th>Message</th>" +
          "</tr>";

        //Get a reference to the error log data in the object from the server.
        const errors = json.error_log;

        //Iterate through each error and transform it into HTML.
        for( const index in errors ) {
          dom_text += "<tr>";
          dom_text += "<td>" + errors[index].timestamp + "</td>";
          dom_text += "<td>" + errors[index].severity + "</td>";
          dom_text += "<td>" + errors[index].source + "</td>";
          dom_text += "<td>" + errors[index].message + "</td>";
          dom_text += "</tr>";
        }
        dom_text += "</table>"

        //Append the HTML table of errors to the DOM.
        dom_handle.innerHTML = dom_text;
      });
  }