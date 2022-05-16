"use strict";


/*
Function to attach menu button click event listeners upon window load.
*/
window.addEventListener( 'load', (window_loaded) => {
  //Get a reference to the menu button itself.
  const menu_btn = document.getElementById("menu_button");

  //Attach a click event listener to the menu itself to show/hide the menu upon click.
  menu_button.addEventListener( 'click', menu_click );

  //Create an array of objects containing the button text, DOM ID, and function
  //for each menu button.
  const admin_menu_buttons = [
    {
      "dom_name": "error_log_button",
      "show_function": "switch_interface(\"error_log_container\")",
      "initialize_function": "get_errors()",
      "button_text": "Error Log"
    },
    {
      "dom_name": "edit_blog_button",
      "show_function": "switch_interface(\"edit_blog_interface\")",
      "initialize_function": "launch_edit_blog_interface()",
      "button_text": "Edit Blog"
    },
    {
      "dom_name": "edit_portfolio_button",
      "show_function": "switch_interface(\"edit_portfolio_interface\")",
      "initialize_function": "initialize_edit_portfolio_interface()",
      "button_text": "Edit Portfolio"
    }
  ];

  //Hand the array of button objects to the function to attach them to the DOM.
  populate_menu_buttons( admin_menu_buttons );
});


/*
Function to populate the create the menu buttons.
*/
function populate_menu_buttons( menu_buttons ) {
  //Get a reference to the collapsible/expansible menu.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Create an empty string to hold the string bashed HTML elements.
  let dom_text = "";

  //Iterate through every menu button object and transform each into HTML.
  for( const index in menu_buttons ) {
    const button_ref = menu_buttons[index];
    dom_text += "<div onclick=\'" +
      button_ref.show_function + "; " +
      button_ref.initialize_function + "; " +
      "hide_menu(); " +
      "\' " +
      "class=\'menu_button\'>" + button_ref.button_text +
      "</div>";
  }

  //Set the height of the menu so that it will animate it's opening.
  menu.height = (menu_buttons.length * 4) + "rem";

  //Set the menu buttons to be the content held by the menu.
  menu_collapsible.innerHTML = dom_text;
}


/*
Global object to contain menu dropdown information.
*/
const menu = {
  is_open: false,
  height: "12px"
}


/*
Function to show or hide the menu.
*/
function menu_click( click_event ) {
  //If the menu is not open, show it, otherwise, hide it.
  if( menu.is_open == false ) {
    show_menu();
  } else {
    hide_menu();
  }
}


/*
Function to draw the menu with a smooth open animation.
*/
function show_menu() {
  //Get a reference to the collapsible/expansible menu.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Set the menu's height so that the CSS will animate it opening smoothly.
  menu_collapsible.style["height"] = menu.height;

  //Remember that the menu is now open.
  menu.is_open = true;
}


/*
Function to hide the menu with a smooth close animation.
*/
function hide_menu() {
  //Get a reference to the collapsible/expansible menu.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Set the menu's height so that the CSS will animate it closing smoothly.
  menu_collapsible.style["height"] = "0px";
  
  //Remember that the menu is now closed.
  menu.is_open = false;
}