function launch_edit_blog_interface() {
  show_edit_blog_interface();
  blog_interface_attach_events();

  get_roots();
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

    const new_post_object = JSON.stringify({
      "title": title_text,
      "body": body_text,
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
console.log( "Submitting post : " );
console.dir( new_post_object );
    fetch( new_post_request )
      .then( response => response.json() )
      .then( json => {
        console.dir( json );
        get_roots();
      });
  });
}

function blog_interface_detach_events() {
  
}

function get_roots() {
  const roots_request = new Request (
    ip + "get_root_posts"
  );
  fetch( roots_request )
    .then( response => response.json() )
    .then( json => {
      console.dir( json );
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
