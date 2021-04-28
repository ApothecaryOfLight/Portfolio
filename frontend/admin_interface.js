window.addEventListener( 'load', (window_loaded) => {
  console.log( "Admin interface loaded!" );

  const admin_buttons = [
    {
      "dom_name": "error_log_button",
      "function": "launch_error_log_interface()",
      "button_text": "Error Log"
    },
    {
      "dom_name": "edit_blog_button",
      "function": "launch_edit_blog_interface()",
      "button_text": "Edit Blog"
    },
    {
      "dom_name": "edit_portfolio_button",
      "function": "launch_edit_portfolio_interface()",
      "button_text": "Edit Portfolio"
    }
  ];

  populate_menu_buttons( admin_buttons );
});

function launch_error_log_interface() {
  console.log( "TODO: Move this to edit_blog_interface.js" );
  const edit_blog_interface =
    document.getElementById("edit_blog_interface");
  const error_log_container =
    document.getElementById("error_log_container");
  const edit_portfolio_interface =
    document.getElementById("edit_portfolio_interface");

  edit_blog_interface.style.display = "none";
  error_log_container.style.display = "block";
  edit_portfolio_interface.style.display = "none";

  get_errors();
}

function get_errors() {
  const get_errors_request = new Request(
    ip + 'get_errors'
  );
  fetch( get_errors_request )
    .then( json => json.json() )
    .then( json => {
      console.dir( json );
      const dom_handle = document.getElementById("error_log_container");
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
