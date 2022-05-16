/*
Function to attach menu button click event listeners upon window load.
*/
window.addEventListener( 'load', (window_loaded) => {
  const menu_btn = document.getElementById("menu_button");
  menu_button.addEventListener( 'click', menu_click );

  const menu_collapsible = document.getElementById("menu_collapsible");
});


/*
Function to populate the create the menu buttons.
*/
function populate_menu_buttons( menu_buttons ) {
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  let dom_text = "";
  for( index in menu_buttons ) {
    const button_ref = menu_buttons[index];
    dom_text += "<div onclick=\'" +
      button_ref.function + "; " +
      "hide_menu(); " +
      "\' " +
      "class=\'menu_button\'>" + button_ref.button_text +
      "</div>";
  }
  menu.height = (menu_buttons.length * 4) + "rem";
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
    show_menu();
  } else {
    hide_menu();
  }
}


/*
Function to draw the menu with a smooth open animation.
*/
function show_menu() {
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  menu_collapsible.style["height"] = menu.height;
  menu.is_open = true;
}


/*
Function to hide the menu with a smooth close animation.
*/
function hide_menu() {
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  menu_collapsible.style["height"] = "0px";
  menu.is_open = false;
}


/*
Menu button function to scroll to the contact me element.
*/
function scroll_to_contact_me() {
  launch_portfolio();
  const contact_me = document.getElementById("contact_me");
  contact_me.scrollIntoView({
    block: 'center',
    behavior: 'smooth'
  });
}