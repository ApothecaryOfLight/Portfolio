window.addEventListener( 'load', (click) => {
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

  const send_message = document.getElementById("submit_contact_me");
  send_message.addEventListener( 'click', (click) => {
    const name = document.getElementById("name").value;
    const org = document.getElementById("org").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const msg = document.getElementById("msg").value;
    const send_contact_me = new Request(
      ip + 'contact_me/',
      {
        method: 'POST',
        body: JSON.stringify({
          "name" : name,
          "org" : org,
          "phone" : phone,
          "email" : email,
          "msg" : msg
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    fetch( send_contact_me );
  });


  window.addEventListener( 'resize', (resize) => {
    console.log( "resize" );
  });
});

function getX( inValue ) {
  return inValue.slice( 11, -3 );
}

function scroll_to_contact_me() {
  launch_portfolio();
  const contact_me = document.getElementById("contact_me");
  contact_me.scrollIntoView({
    block: 'center',
    behavior: 'smooth'
  });
}
