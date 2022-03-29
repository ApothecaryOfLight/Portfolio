window.addEventListener( 'load', (click) => {
    launch_portfolio();
  
    populate_menu_buttons();
  
    attach_contact_me_listener();
  
    window.addEventListener( 'resize', (resize) => {
      console.log( "resize" );
    });
  });