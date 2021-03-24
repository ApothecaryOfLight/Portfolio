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

  const gallery = {
    "oinker": 0,
    "ketris" : 0,
    "cineflix": 0,
    "triviacards": 0
  }

  const ketris_next = document.getElementById("ketris_pic_next");
  ketris_next.addEventListener( 'click', (click) => {
    const ketris_image = document.getElementById("ketris_01");
    const ketris_imageB = document.getElementById("ketris_02");
    const ketris_imageC = document.getElementById("ketris_03");
    const ketris_comp = window.getComputedStyle( ketris_image );

    const width = ketris_comp.getPropertyValue( 'width' ).slice(0,-2);
    const offset = getX( ketris_image.style.transform );

    let mod = (offset-width) + "px";
    gallery.ketris++;
    if( offset-width < width*-2 ) {
      mod = (width*-2) + "px";
      gallery.ketris = 2;
    }

    const effect = "translateX(" + mod + ")";

    ketris_image.style.transform = effect;
    ketris_imageB.style.transform = effect;
    ketris_imageC.style.transform = effect;
  });

  const ketris_last = document.getElementById("ketris_pic_last");
  ketris_last.addEventListener( 'click', (click) => {
    const ketris_image = document.getElementById("ketris_01");
    const ketris_imageB = document.getElementById("ketris_02");
    const ketris_imageC = document.getElementById("ketris_03");
    const ketris_comp = window.getComputedStyle( ketris_image );

    const width = Number(
      ketris_comp.getPropertyValue( 'width' ).slice(0,-2));
    const offset = Number(
      getX( ketris_image.style.transform ));



    let mod = (offset+width) + "px";
    gallery.ketris--;
    if( offset+width > 0 ) {
      mod = 0;
      gallery.ketris = 0;
    }

    const effect = "translateX(" + mod + ")";

    ketris_image.style.transform = effect;
    ketris_imageB.style.transform = effect;
    ketris_imageC.style.transform = effect;
  });

  window.addEventListener( 'resize', (resize) => {
    console.log( "resize" );
    if( gallery.ketris != 0 ) {
      const ketris_image = document.getElementById("ketris_01");
      const ketris_imageB = document.getElementById("ketris_02");
      const ketris_imageC = document.getElementById("ketris_03");
      const ketris_comp = window.getComputedStyle( ketris_image );

      const width = Number(
        ketris_comp.getPropertyValue( 'width' ).slice(0,-2));
      const mod = (width * gallery.ketris);
      const effect = "translateX(-" + mod + "px)";
      ketris_image.style.transform = effect;
      ketris_imageB.style.transform = effect;
      ketris_imageC.style.transform = effect;
    }
  });
});

function getX( inValue ) {
  return inValue.slice( 11, -5 );
}
