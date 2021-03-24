window.addEventListener( 'load', (click) => {
  const contact_me_btn = document.getElementById("contact_me_button");
  contact_me_btn.addEventListener( 'click', (click) => {
    const contact_me = document.getElementById("contact_me");
    contact_me.scrollIntoView( {
      block: 'center',
      behavior: 'smooth'
    } );
  });


  const send_message = document.getElementById("submit_contact_me");
  send_message.addEventListener( 'click', (click) => {
    console.log( "test");

    const name = document.getElementById("name").value;
    const org = document.getElementById("org").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const msg = document.getElementById("msg").value;

    const send_contact_me = new Request(
      'http://34.214.192.120:3000/contact_me/',
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
});
