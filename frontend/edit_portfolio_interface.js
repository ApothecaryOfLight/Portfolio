function launch_edit_portfolio_interface() {
  console.log( "Launch edit portfolio interface" );
  const edit_blog_interface =
    document.getElementById("edit_blog_interface");
  const error_log_container =
    document.getElementById("error_log_container");
  const edit_portfolio_interface =
    document.getElementById("edit_portfolio_interface");

  edit_blog_interface.style.display = "none";
  error_log_container.style.display = "none";
  edit_portfolio_interface.style.display = "block";

  attach_events();
  get_portfolio_entries();
}

const event_objects = [
  {
    "element_name": "portfolio_dropdown",
    "func": select_portfolio_entry,
    "event_type": "change"
  },
  {
    "element_name": "portfolio_add_image",
    "func": portfolio_add_image,
    "event_type": "click"
  },
  {
    "element_name": "portfolio_submit_entry",
    "func": portfolio_submit_entry,
    "event_type": "click"
  },
  {
    "element_name": "portfolio_delete_button",
    "func": portfolio_delete,
    "event_type": "click"
  }
];

function portfolio_delete( inEntityID ) {
  if( inEntityID ) {
    const delete_request = new Request(
      ip + "delete_entity/" + inEntityID
    );
    fetch( delete_request )
      .then( response => response.json() )
      .then( json => {
        blank_portfolio_fields();
      });
  }
}

function attach_events( inPortfolioEntityID ) {
  detach_events();
  for( index in event_objects ) {
    const event_ref = event_objects[index];
    const dom_ref =
      document.getElementById( event_ref.element_name );
    if( inPortfolioEntityID ) {
      const bound_func = event_ref.func.bind(
        null,
        inPortfolioEntityID
      );
      dom_ref.addEventListener(
        event_ref.event_type,
        bound_func
      );
    } else {
      const bound_func = event_ref.func.bind(
        null,
        null
      );
      dom_ref.addEventListener(
        event_ref.event_type,
        bound_func
      );
    }
  }
}

function detach_events() {
  for( index in event_objects ) {
    const event_ref = event_objects[index];
    const delE = document.getElementById( event_ref.element_name );
    const newE = delE.cloneNode( true );
    delE.parentNode.replaceChild( newE, delE );
  }
}


/*Portfolio Entires*/
function get_portfolio_entries( inDropdownValue ) {
  const get_portfolio_entries_request = new Request(
    ip + "get_portfolio_entries"
  );
  fetch( get_portfolio_entries_request )
    .then( response => response.json() )
    .then( json => {
      compose_portfolio_entries(
        json.portfolio_entries,
        inDropdownValue
      );
    });
}

function compose_portfolio_entries(
  portfolio_entries,
  inDropdownValue
) {
  let dom_string =
    "<option value=\'-1\'>New Portfolio Entry</option>";
  for( index in portfolio_entries ) {
    dom_string += "<option value=\'";
    dom_string += portfolio_entries[index].portfolio_entry_id;
    dom_string += "\'>";
    dom_string += portfolio_entries[index].portfolio_title;
    dom_string += "</option>";
  }
  const dropdown =
    document.getElementById("portfolio_dropdown");
  dropdown.innerHTML = dom_string;
  if( !inDropdownValue ) {
    dropdown.value = -1;
  } else {
    dropdown.value = inDropdownValue;
  }
}

function select_portfolio_entry() {
  const dropdown =
    document.getElementById("portfolio_dropdown");

  if( dropdown.value == -1 ) {
    blank_portfolio_fields();
    attach_events();
    return;
  }

  const entity_value = dropdown.value;
  const get_portfolio_entry = new Request(
    ip + "get_portfolio_entry/" + entity_value
  );
  fetch( get_portfolio_entry )
    .then( response => response.json() )
    .then( json => {
      blank_portfolio_fields( entity_value );
      render_portfolio_entry( json.portfolio_entry );
      Object.assign( portfolio_images, json.images );
      render_portfolio_image_gallery();
      attach_events( entity_value );
    });
}

function render_portfolio_entry( portfolioEntry ) {
  const title_field =
    document.getElementById("portfolio_title_field");
  const github_field =
    document.getElementById("portfolio_github_field");
  const live_page_field =
    document.getElementById("portfolio_live_page_field");
  const description_field =
    document.getElementById("portfolio_description_field");
  const flags_field =
    document.getElementById("portfolio_flags_field");

  title_field.value = portfolioEntry.portfolio_title;
  github_field.value = portfolioEntry.github_link;
  live_page_field.value = portfolioEntry.live_page;
  description_field.value = portfolioEntry.portfolio_text;
  flags_field.value = portfolioEntry.portfolio_flags;
}

function blank_portfolio_fields( inDropdownValue ) {
  const title_field =
    document.getElementById("portfolio_title_field");
  const github_field =
    document.getElementById("portfolio_github_field");
  const live_page_field =
    document.getElementById("portfolio_live_page_field");
  const description_field =
    document.getElementById("portfolio_description_field");
  const flags_field =
    document.getElementById("portfolio_flags_field");

  title_field.value = "";
  github_field.value = "";
  live_page_field.value = "";
  description_field.value = "";
  flags_field.value = "";

  while( portfolio_images.length > 0 ) {
    portfolio_images.pop();
  }

  const portfolio_images_container =
    document.getElementById("portfolio_images_container");
  portfolio_images_container.innerHTML = "";

  get_portfolio_entries( inDropdownValue );
}


/**/
function new_portfolio_entry() {

}


/*Images*/
const portfolio_images = [];
function portfolio_add_image() {
  portfolio_select_image();
}

function portfolio_select_image() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';/**/
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = readerEvent => {
      portfolio_add_image_to_gallery( readerEvent );
    }
  }
  input.click();
}

function portfolio_add_image_to_gallery( inImageData ) {
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

  portfolio_images.push({
    "image_data": rawImageData,
    "local_image_id": generate_portfolio_temp_image_id()
  });

  render_portfolio_image_gallery();
}

function delete_image_from_gallery() {

}

function generate_portfolio_temp_image_id() {
//  const ids = [];
  let max = 0;
  for( index in portfolio_images ) {
    //ids.push( portfolio_images[index].local_image_id );
    max = Math.max(
      portfolio_images[index].local_image_id,
      max
    );
  }
  return max;
/*  for( i=0; i<100; i++ ) {
    if( !ids.includes( i ) ) {
      return i;
    }
  }*/
  //TODO: Throw ID generation error.
}

function render_portfolio_image_gallery() {
console.dir( portfolio_images );
  if( portfolio_images.length == 0 ) {
    return;
  }
  let html_string = "";
  for( index in portfolio_images ) {
    html_string += "<div class=\'portfolio_image_container\'>" +
      "<div class=\'portfolio_image_body\'>" +
      "<img class=\'portfolio_image_image\' " +
      "src=\'" + portfolio_images[index].image_data + "\'>" +
      "<div class=\'portfolio_image_tools\'>" +
      "<button class=\'portfolio_image_delete\' " +
      "onclick=\'delete_portfolio_image(" +
      portfolio_images[index].local_image_id +
      ");\'" +
      ">X</button>" +
      "</div>" +
      "</div></div>";
  }
  const portfolio_images_container =
    document.getElementById("portfolio_images_container");
  portfolio_images_container.innerHTML = html_string;
}

function delete_portfolio_image( inLocalImageID ) {
  console.log( "delete image: " + inLocalImageID );
}

function get_portfolio_images_object() {
  const portfolio_images_object = [];
  for( index in portfolio_images ) {
    portfolio_images_object.push({
      "local_image_id": portfolio_images[index].local_image_id,
      "image_data": portfolio_images[index].image_data
    });
  }
  return portfolio_images_object;
}


/*Submit*/
function portfolio_submit_entry( existingPortfolioEntryID ) {
  const title_field =
    document.getElementById("portfolio_title_field");
  const github_field =
    document.getElementById("portfolio_github_field");
  const live_page_field =
    document.getElementById("portfolio_live_page_field");
  const description_field =
    document.getElementById("portfolio_description_field");
  const flags_field =
    document.getElementById("portfolio_flags_field");

  const portfolio_entry_object = {
    "portfolio_entry_id": existingPortfolioEntryID,
    "title": title_field.value,
    "github": github_field.value,
    "live_page": live_page_field.value,
    "description": description_field.value,
    "flags": flags_field.value,
    "images": get_portfolio_images_object()
  };

  const submit_portfolio_request = new Request(
    ip + "add_portfolio_entry",
    {
      method: "POST",
      body: JSON.stringify( portfolio_entry_object ),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  fetch( submit_portfolio_request )
    .then( response => response.json() )
    .then( json => {
      if( json.result == "success" ) {
        console.log( "Yay" );
        blank_portfolio_fields();
      } else {
        console.log( json.reason );
        console.log( "error" );
      }
    });
}
