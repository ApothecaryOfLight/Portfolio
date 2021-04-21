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

const menu = {
  is_open: false
}
function menu_click( click_event ) {
  console.log( "click!" );
  const menu_collapsible =
    document.getElementById("menu_collapsible");
  if( menu.is_open == false ) {
    menu_collapsible.style["height"] = "250px";
    menu.is_open = true;
  } else {
    menu_collapsible.style["height"] = "0px";
    menu.is_open = false;
  }
}

function menu_hover( hover_event ) {
  console.log( "hover " + hover_event );
}

function menu_unhover( hover_event ) {
  console.log( "unhover " + hover_event );
}
