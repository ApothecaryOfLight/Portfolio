window.addEventListener( 'load', (click) => {
  const contact_me_btn = document.getElementById("contact_me_button");
  contact_me_btn.addEventListener( 'click', (click) => {
    const contact_me = document.getElementById("contact_me");
    contact_me.scrollIntoView( {
      block: 'center',
      behavior: 'smooth'
    } );
  });
});
