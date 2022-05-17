"use strict";

  
/*
Function to attach blog edit events to their respective elements.
*/
function attach_blog_interface_events( inPostID ) {
  //Create an array of objects to attach functions to their respective elements.
  const events = [
    {
      element_name: "submit_post",
      event: "click",
      func: submit_post
    },
    {
      element_name: "new_blog_old_post",
      event: "change",
      func: new_blog_old_post
    },
    {
      element_name: "add_new_image",
      event: "click",
      func: select_image
    },
    {
      element_name: "new_blog_delete",
      event: "click",
      func: delete_post
    }
  ];

  //Detach existing event listeners.
  blog_interface_detach_events( events );

  //Iterate through every object and attach events.
  for( const index in events ) {
    //Get a reference to the event object.
    const event_ref = events[index];

    //Get a reference to the DOM element.
    const element_ref = document.getElementById( event_ref.element_name );

    //If these events pertain to a blog post, add that to the bound function.
    if( inPostID ) {
      //Bind the function with the provided post ID.
      const func_ref = event_ref.func.bind( null, inPostID );
      
      //Add the function as the callback to the event.
      element_ref.addEventListener(
        event_ref.event,
        func_ref
      );
    } else {
      //Add the function as a callback to the event.
      element_ref.addEventListener(
        event_ref.event,
        event_ref.func
      );
    }
  }
}


/*
Function to detach event listeners from their elements.
*/
function blog_interface_detach_events( events ) {
  //Iterate through every event object.
  for( const index in events ) {
    //Get a reference to this event.
    const event_ref = events[index];

    //Get a reference to this DOM element.
    const delE = document.getElementById( event_ref.element_name );

    //Clone this element and replace it with it's clone, which will delete all
    //attached event listeners.
    const newE = delE.cloneNode( true );
    delE.parentNode.replaceChild( newE, delE );
  }
}