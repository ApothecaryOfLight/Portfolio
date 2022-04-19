window.addEventListener( 'load', (window_loaded) => {
  console.log( "Loaded window." );

  const menu_btn = document.getElementById("menu_button");
  const menu_btn_hover_bound = menu_hover.bind( null, "menu_button" );
  const menu_btn_unhover_bound = menu_unhover( null, "menu_button" );
  menu_button.addEventListener( 'click', menu_click );
  menu_button.addEventListener( 'mouseover', menu_btn_hover_bound );
  menu_button.addEventListener( 'mouseout', menu_btn_unhover_bound );

  const menu_hover_bound = menu_hover.bind( null, "menu" );
  const menu_unhover_bound = menu_unhover( null, "menu" );
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  menu_collapsible.addEventListener( 'mouseover', menu_hover_bound );
  menu_collapsible.addEventListener( 'mouseout', menu_unhover_bound );
});

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

const menu = {
  is_open: false,
  height: "12px"
}
function menu_click( click_event ) {
  console.log( "click!" );
  if( menu.is_open == false ) {
    show_menu();
  } else {
    hide_menu();
  }
}

function menu_hover( hover_event ) {
//  console.log( "hover " + hover_event );
}

function menu_unhover( hover_event ) {
//  console.log( "unhover " + hover_event );
}

function show_menu() {
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  menu_collapsible.style["height"] = menu.height;
  menu.is_open = true;
}

function hide_menu() {
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  menu_collapsible.style["height"] = "0px";
  menu.is_open = false;
}

function scroll_to_contact_me() {
  launch_portfolio();
  const contact_me = document.getElementById("contact_me");
  contact_me.scrollIntoView({
    block: 'center',
    behavior: 'smooth'
  });
}