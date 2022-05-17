"use strict";


/*
Function to attach menu button click event listeners upon window load.
*/
window.addEventListener( 'load', (window_loaded) => {
  //Get a reference to the menu button.
  const menu_btn = document.getElementById("menu_button");

  //Attach the menu click callback as a response to a click event on the button button.
  menu_button.addEventListener( 'click', menu_click );
});


/*
Function to populate the create the menu buttons.

menu_buttons: Buttons to add to the menu.
*/
function populate_menu_buttons( menu_buttons ) {
  //Get a reference to the collapsible menu element.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Create a string to store the menu buttons as HTML.
  let dom_text = "";

  //Iterate through each menu button.
  for( const index in menu_buttons ) {
    //Convert this menu button into HTML.
    const button_ref = menu_buttons[index];
    dom_text += "<div onclick=\'" +
      button_ref.function + "; " +
      "hide_menu(); " +
      "\' " +
      "class=\'menu_button\'>" + button_ref.button_text +
      "</div>";
  }

  //Set the menu height so that the CSS will facilitate smooth animation of the
  //menu expanding.
  menu.height = (menu_buttons.length * 4) + "rem";

  //Set the content of the menu to the string of HTML we created.
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
  if( menu.is_open == false ) {
    //If the menu is hidden, show it.
    show_menu();
  } else {
    //If the menu is shown, hide it.
    hide_menu();
  }
}


/*
Function to draw the menu with a smooth open animation.
*/
function show_menu() {
  //Get a reference to the collapsible menu.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Set the height of the menu so that the CSS will smoothly animate it.
  menu_collapsible.style["height"] = menu.height;

  //Remember that the menu is open.
  menu.is_open = true;
}


/*
Function to hide the menu with a smooth close animation.
*/
function hide_menu() {
  //Get a reference to the collapsible menu.
  const menu_collapsible = document.getElementById("menu_collapsible");

  //Set the height of the element to 0px, so that the CSS will smoothly collapse it.
  menu_collapsible.style["height"] = "0px";

  //Remember that the menu is closed.
  menu.is_open = false;
}


/*
Menu button function to scroll to the contact me element.
*/
function scroll_to_contact_me() {
  //Ensure that the portfolio interface is displayed.
  launch_portfolio();

  //Get a reference to the contact me element.
  const contact_me = document.getElementById("contact_me");

  //Smooth scroll to the contact me element.
  contact_me.scrollIntoView({
    block: 'center',
    behavior: 'smooth'
  });
}