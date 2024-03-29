/*
Event listener for the window to finish loading.

Will launch the portfolio and load the menu buttons.
*/
window.addEventListener( 'load', (event) => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scroll({ top: 0, behavior: 'smooth' });
  
  launch_portfolio();

  const menu_buttons = [
    {
      "dom_name": "portfolio_button",
      "function": "launch_portfolio()",
      "button_text": "Portfolio"
    },
    {
      "dom_name": "blog_button",
      "function": "launch_blog()",
      "button_text": "Blog"
    },
    {
      "dom_name": "contact_me_button",
      "function": "scroll_to_contact_me()",
      "button_text": "Contact Me"
    }
  ];

  populate_menu_buttons( menu_buttons );

  attach_contact_me_listener();
});

window.addEventListener('beforeunload', (e) => {
  window.scroll({ top: 0 });
});