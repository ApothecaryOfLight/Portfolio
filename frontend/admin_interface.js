window.addEventListener( 'load', (window_loaded) => {
  console.log( "All loaded!" );
  get_errors();
});

function get_errors() {
  const get_errors_request = new Request(
    ip + 'get_errors'
  );
  fetch( get_errors_request )
    .then( json => json.json() )
    .then( json => {
      console.dir( json );
      const dom_handle = document.getElementById("error_log");
      let dom_text = "<table rules=\'all\' style=\'border:1px solid;\'>" +
        "<tr>" +
          "<th>Timestamp</th>" +
          "<th>Severity</th>" +
          "<th>Source</th>" +
          "<th>Message</th>" +
        "</tr>";
      const errors = json.error_log;
      for( index in errors ) {
        dom_text += "<tr>";
        dom_text += "<td>" + errors[index].timestamp + "</td>";
        dom_text += "<td>" + errors[index].severity + "</td>";
        dom_text += "<td>" + errors[index].source + "</td>";
        dom_text += "<td>" + errors[index].message + "</td>";
        dom_text += "</tr>";
      }
      dom_text += "</table>"
      dom_handle.innerHTML = dom_text;
    });
}
