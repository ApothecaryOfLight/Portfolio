"use strict";


/*
Attach event listeners to their respective elements.
*/
function attach_edit_portfolio_events( inPortfolioEntityID ) {
    //Create an object to contain event listener data.
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

    //Detach existing event listeners.
    detach_events(event_objects);

    //Iterate through every event object.
    for( const index in event_objects ) {
        //Get a reference to the event object.
        const event_ref = event_objects[index];

        //Get a reference to the DOM element to attach a listener to.
        const dom_ref = document.getElementById( event_ref.element_name );

        if( inPortfolioEntityID ) {
            //If a portfolio ID is provided, then bind that ID to the function.
            const bound_func = event_ref.func.bind(
                null,
                inPortfolioEntityID
            );
            
            //Add the event listener to the DOM element.
            dom_ref.addEventListener(
                event_ref.event_type,
                bound_func
            );
        } else {
            //Otherwise, simply bind the function.
            const bound_func = event_ref.func.bind(
                null,
                null
            );
            
            //Add the event listener to the DOM element.
            dom_ref.addEventListener(
                event_ref.event_type,
                bound_func
            );
        }
    }
}


/*
Detach event listeners from their respective elements.
*/
function detach_events( event_objects ) {
    //Iterate through every event listener.
    for( const index in event_objects ) {
        //Get a reference to the event.
        const event_ref = event_objects[index];

        //Get a reference to the DOM element.
        const delE = document.getElementById( event_ref.element_name );

        //Clone the node and use the clone to replace the original, which will
        //delete all existing event listeners attached to the element.
        const newE = delE.cloneNode( true );
        delE.parentNode.replaceChild( newE, delE );
    }
}