function launch_edit_blog_interface() {
  show_edit_blog_interface();
  blog_interface_attach_events();

  render_edit_blog_interface();
}

function render_edit_blog_interface() {
  get_roots();
  get_existing_posts();
  blank_fields();
}

function show_edit_blog_interface() {
  const edit_blog_interface =
    document.getElementById("edit_blog_interface");
  const error_log_container =
    document.getElementById("error_log_container");
  error_log_container.style.display = "none";
  edit_blog_interface.style.display = "block";
}

function blog_interface_attach_events() {
  const submit_new_btn =
    document.getElementById("submit_post");

  submit_new_btn.addEventListener( 'click', (click) => {
    const title_field =
      document.getElementById("new_blog_title");
    const body_field =
      document.getElementById("new_blog_body");
    const root_id_field =
      document.getElementById("new_blog_root");

    const title_text = title_field.value;
    const body_text = body_field.value;
    const root_id = root_id_field.value;

    const edit_post_dropdown =
      document.getElementById("new_blog_old_post");
    const edit_post_id = edit_post_dropdown.value;

    if( edit_post_id == -1 ) {
      const new_post_object = JSON.stringify({
        "title": process_outgoing_text( title_text ),
        "body": process_outgoing_text( body_text ),
        "root": root_id,
        "postorder": "???",
        "password_hash": "???"
      });
      const new_post_request = new Request(
        ip + 'new_blog_post',
        {
          method: "POST",
          body: new_post_object,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      fetch( new_post_request )
        .then( response => response.json() )
        .then( json => {
          render_edit_blog_interface();
        });
    } else {
      const edit_post_object = JSON.stringify({
        "post_id": edit_post_id,
        "title": process_outgoing_text( title_text ),
        "body": process_outgoing_text( body_text ),
        "root": root_id,
        "postorder": "???",
        "password_hash": "???"
      });
      const edit_post_request = new Request(
        ip + 'edit_blog_post',
        {
          method: "POST",
          body: edit_post_object,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      fetch( edit_post_request )
        .then( response => response.json() )
        .then( json => {
          render_edit_blog_interface();
        });
    }
  });

  const edit_posts_dropdown = 
    document.getElementById("new_blog_old_post");
  edit_posts_dropdown.addEventListener( 'change', (change) => {
    if( change.path[0].value != -1 ) {
      load_blog_post( change.path[0].value );
    } else {
      blank_fields();
    }
  });
}

function blog_interface_detach_events() {
  
}

function process_outgoing_text( inText ) {
  let processed_text = inText.replace(
    /\'/g,
    "&#39;"
  );
  processed_text = processed_text.replace(
    /\"/g,
    "&#34;"
  );
  processed_text = processed_text.replace(
    /\\/g,
    "&#92;"
  );
  processed_text = processed_text.replace(
    /\//g,
    "&#47;"
  );
  processed_text = processed_text.replace(
    /[\r\n\b]/g,
    "<br>"
  );
  return processed_text;
}

function process_incoming_text( inText ) {
  let processed_text = inText.replace(
    /&#39;/g,
    "\'"
  );
  processed_text = processed_text.replace(
    /&#34;/g,
    "\""
  );
  processed_text = processed_text.replace(
    /&#92;/g,
    "\\"
  );
  processed_text = processed_text.replace(
    /&#47;/g,
    "\/"
  );
  processed_text = processed_text.replace(
    /<br>/g,
    "\n"
  );
  return processed_text;
}

function blank_fields() {
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");
  title_field.value = "";
  root_field.value = "-1";
  body_field.value = "";
}

/*Root Posts*/
function get_roots() {
  const roots_request = new Request (
    ip + "get_root_posts"
  );
  fetch( roots_request )
    .then( response => response.json() )
    .then( json => {
      compose_roots( json.roots );
    });
}

function compose_roots( roots ) {
  let dom_string = "<option value=\'-1\'>New Series</option>";
  for( index in roots ) {
    dom_string += "<option value=\'";
    dom_string += roots[index].post_id + "\'>";
    dom_string += roots[index].title + "</option>";
  }
  const dropdown = document.getElementById("new_blog_root");
  dropdown.innerHTML = dom_string;
}

/*Existing Posts*/
function get_existing_posts() {
  const existing_request = new Request (
    ip + "get_existing_posts"
  );
  fetch( existing_request )
    .then( response => response.json() )
    .then( json => {
      compose_existing( json.existing );
    });
}

function compose_existing( existing ) {
  let dom_string = "<option value=\'-1\'>New Post</option>";
  for( index in existing ) {
    dom_string += "<option value=\'";
    dom_string += existing[index].post_id + "\'>";
    dom_string += existing[index].title + "</option>";
  }
  const dropdown = document.getElementById("new_blog_old_post");
  dropdown.innerHTML = dom_string;
}

function load_blog_post( inPostID ) {
  const existing_request = new Request (
    ip + "get_blog_post/" + inPostID
  );
  fetch( existing_request )
    .then( response => response.json() )
    .then( json => {
      render_blog_post( json.post_data );
    });
}

function render_blog_post( post_data ) {
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");
  title_field.value = process_incoming_text( post_data.title );
  if( post_data.root_id != null ) {
    root_field.value = post_data.root_id;
  } else {
    root_field.value = -1;
  }
  body_field.value = process_incoming_text( post_data.body );
}
