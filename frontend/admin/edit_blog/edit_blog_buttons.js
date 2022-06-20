"use strict";

//Create an array of objects to attach functions to their respective elements.
const blog_edit_events = [
  {
    element_name: "submit_post",
    event: "click",
    func: submit_post,
    func_ref: null
  },
  {
    element_name: "blog_post_dropdown",
    event: "change",
    func: select_blog_post,
    func_ref: null
  },
  {
    element_name: "get_image",
    event: "click",
    func: upload_images,
    func_ref: null
  },
  {
    element_name: "new_blog_delete",
    event: "click",
    func: delete_post,
    func_ref: null
  },
  {
    element_name: "blog_series_dropdown",
    event: "change",
    func: select_blog_series,
    func_ref: null
  },
  {
    element_name: "add_code_block_button",
    event: "click",
    func: add_code_block,
    func_ref: null
  }
];
  
/*
Function to attach blog edit events to their respective elements.
*/
function attach_edit_blog_interface_events( blog_edit_data ) {
  //Iterate through every object and attach events.
  for( const index in blog_edit_events ) {
    //Get a reference to the event object.
    const event_ref = blog_edit_events[index];

    //Get a reference to the DOM element.
    const element_ref = document.getElementById( event_ref.element_name );

    //Bind the function with a reference to the blog edit data.
    event_ref.func_ref = event_ref.func.bind( null, blog_edit_data );
    
    //Add the function as the callback to the event.
    element_ref.addEventListener(
      event_ref.event,
      event_ref.func_ref
    );
  }
}


/*
Function to detach event listeners from their elements.
*/
function blog_interface_detach_events() {
  //Iterate through every event object.
  for( const index in blog_edit_events ) {
    //Get a reference to the event object.
    const event_ref = blog_edit_events[index];

    //Get a reference to the DOM element.
    const element_ref = document.getElementById( event_ref.element_name );

    //Remove event listener.
    element_ref.removeEventListener(
      event_ref.event,
      event_ref.func
    );
  }
}

function add_code_block() {
  const code_block = document.createElement("pre");
  const myInput = document.getElementById("myInput");
  code_block.textContent = "Code Here";
  code_block.classList = "blog_post_code_section";
  myInput.appendChild( code_block );

  const extra_div = document.createElement("div");
  extra_div.textContent = "Text here";
  myInput.appendChild( extra_div );
}