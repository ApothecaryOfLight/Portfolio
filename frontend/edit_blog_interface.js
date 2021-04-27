function launch_edit_blog_interface() {
  show_edit_blog_interface();
  blog_interface_attach_events();

  render_edit_blog_interface();
}

function render_edit_blog_interface() {
console.log( "render_edit_blog_interface" );
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
console.log( "blank_fields" );
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");
  title_field.value = "";
  root_field.value = "-1";
  body_field.value = "";
  while( images.length > 0 ) {
    images.pop();
  }
  const image_container =
    document.getElementById("new_blog_images_container");
  image_container.innerHTML = "";
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
      blank_fields();
      render_blog_post( json.post_data );
    });

  const existing_images_request = new Request (
    ip + "get_blog_images/" + inPostID
  );
  fetch( existing_images_request )
    .then( response => response.json() )
    .then( json => {
      Object.assign( images, json.images_data );
      render_blog_images();
    });
}

function render_blog_post( post_data ) {
  const title_field = document.getElementById("new_blog_title");
  const root_field = document.getElementById("new_blog_root");
  const body_field = document.getElementById("new_blog_body");
  const dropdown = document.getElementById("new_blog_old_post");
  dropdown.value = post_data.post_id;
  title_field.value = process_incoming_text( post_data.title );
  if( post_data.root_id != null ) {
    root_field.value = post_data.root_id;
  } else {
    root_field.value = -1;
  }
  body_field.value = process_incoming_text( post_data.body );
}


/*Images*/
function render_blog_images() {
  if( images.length == 0 ) {
    return;
  }
console.dir( images );
  let html_string = "";
  for( index in images ) {
    html_string += "<div class=\'image_container\'>" +
      "<div class=\'image_header\'>" +
      "<input type=\'checkbox\'/>Blurb Image" +
      "</div>" +
      "<div class=\'image_body\'>" +
      "<img class=\'image_image\' " +
      "src=\'" + images[index].image_data + "\'>" +
      "<div class=\'image_tools\'>" +
      "<button class=\'image_delete\'>X</button>" +
      "<button class=\'image_copy_link\' " +
      "onclick=\'copy_link( " +
      images[index].local_image_id + ")\' " +
      ">Copy Link</button>" +
      "</div>" +
      "</div></div>";
  }
  const image_container =
    document.getElementById("new_blog_images_container");
  image_container.innerHTML = html_string;
}

function copy_link( inLocalID ) {
  const image_place_text = "[[[image=" + inLocalID + "]]]";
/*  navigator.clipboard.writeText( image_place_text );*/
  const body = document.getElementById("new_blog_body");
  body.value = body.value.substr( 0, body.selectionStart ) +
    image_place_text +
    body.value.substr( body.selectionStart, body.value.length );
}


//Events
const events = [
  {
    element_name: "submit_post",
    event: "click",
    func: submit_post,
    bound: []
  },
  {
    element_name: "new_blog_old_post",
    event: "change",
    func: new_blog_old_post,
    bound: []
  },
  {
    element_name: "add_new_image",
    event: "click",
    func: select_image,
    bound: []
  },
  {
    element_name: "new_blog_delete",
    event: "click",
    func: delete_post,
    bound: []
  }
];

function blog_interface_attach_events( inPostID ) {
  blog_interface_detach_events();
  for( index in events ) {
    const event_ref = events[index];
    const element_ref =
      document.getElementById( event_ref.element_name );
    if( inPostID ) {
      const func_ref = event_ref.func.bind( null, inPostID );
      element_ref.addEventListener(
        event_ref.event,
        func_ref
      );
      event_ref.bound.push( func_ref );
    } else {
      element_ref.addEventListener(
        event_ref.event,
        event_ref.func
      );
    }
  }
}

function blog_interface_detach_events() {
  for( index in events ) {
    const event_ref = events[index];
    const delE = document.getElementById( event_ref.element_name );
    const newE = delE.cloneNode( true );
    delE.parentNode.replaceChild( newE, delE );
  }
}

function submit_post() {
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

  if( edit_post_id  == -1 ) {
    const new_post_object = {
      "title": process_outgoing_text( title_text ),
      "body": process_outgoing_text( body_text ),
      "root": root_id,
      "postorder": "???",
      "password_hash": "???",
      "images": images
    };
    const new_post_request = new Request(
      ip + 'new_blog_post',
      {
        method: "POST",
        body: JSON.stringify( new_post_object ),
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
}

function delete_post( inPostID ) {
  if( inPostID ) {
    const delete_post = new Request(
      ip + "delete_post/" + inPostID
    );
    fetch( delete_post )
      .then( response => response.json() )
      .then( json => {
        console.log( "Successfully deleted!" );
        get_existing_posts();
        blank_fields();
      });
  }
}

//GOTO
function new_blog_old_post() {
  const edit_post_dropdown =
    document.getElementById("new_blog_old_post");
  const edit_post_id = edit_post_dropdown.value;
  if( edit_post_id != -1 ) {
    load_blog_post( edit_post_id );
    //get_blog_images( edit_post_id );
    blog_interface_attach_events( edit_post_id );
  } else {
    blank_fields();
    blog_interface_attach_events();
    //TODO: Grey out buttons until complete.
    get_new_post_id();
  }
}

function get_new_post_id() {
  const new_id_request = new Request(
    ip + "new_id"
  );
  fetch( new_id_request )
    .then( response => response.json() )
    .then( json => {
      blog_interface_attach_events( json.new_post_id );
    });
}

//On exit/navigate away, if ID genereated but unused, release.
function release_post_id( inPostID ) {
  if( inPostID ) {
    const release_id_request = new Request(
      ip + "release_id/" + inPostID
    );
    fetch( release_id_request )
      .then( response => response.json() )
      .then( json => {
        console.log( "ID released." );
      });
  }
}

const images = [];

function add_image( inPostID ) {

}

function select_image() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';/**/
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = readerEvent => {
      store_image( readerEvent );
    }
  }
  input.click();
}

function generate_temp_image_id() {
  const ids = [];
  for( index in images ) {
    ids.push( images[index].local_image_id );
  }
  for( i=0; i<100; i++ ) {
    if( !ids.includes( i ) ) {
      return i;
    }
  }
  //TODO: Throw ID generation error.
}

function store_image( inImageData ) {
  //1) Get size.
  const size = inImageData.total/1000000;
  if( size > 15 ) {
    alert( "Image too large!" );
    return;
  }

  //2) Get MIME type.
  const mime_type = inImageData.srcElement.result.substr(
    5,
    inImageData.srcElement.result.indexOf(";")-5
  );

  //3) Get the image data.
  const content = inImageData.target.result;
  const pos = inImageData.target.result.indexOf( "," );
  const data = content.substr( pos+1 );

  //4) Compose raw data string.
  const rawImageData = "data:" + mime_type + ";base64," + data;

  images.push({
    "image_data": rawImageData,
    "local_image_id": generate_temp_image_id()
  });

  render_blog_images();
}
