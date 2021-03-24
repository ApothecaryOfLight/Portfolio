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

  const oinker_next = document.getElementById("oinker_pic_next");
  oinker_next.addEventListener( 'click', (click) => {
    const oinker_image = document.getElementById("oinker_01");
    const oinker_imageB = document.getElementById("oinker_02");
    const oinker_imageC = document.getElementById("oinker_03");
    const oinker_imageD = document.getElementById("oinker_04");
    const oinker_comp = window.getComputedStyle( oinker_image );

    const width = oinker_comp.getPropertyValue( 'width' ).slice(0,-2);
console.log( "trans:" + oinker_image.style.transform );
    const offset = getX( oinker_image.style.transform );
console.log( "width: " + width );
console.log( "offset: " + offset );
    let mod = (offset-width) + "px";
    gallery.oinker++;
    if( offset-width < width*-2 ) {
      mod = (width*-3) + "px";
      gallery.oinker = 3;
    }

    const effect = "translateX(" + mod + ")";
console.log( effect );
    oinker_image.style.transform = effect;
    oinker_imageB.style.transform = effect;
    oinker_imageC.style.transform = effect;
    oinker_imageD.style.transform = effect;
  });

  const oinker_last = document.getElementById("oinker_pic_last");
  oinker_last.addEventListener( 'click', (click) => {
    const oinker_image = document.getElementById("oinker_01");
    const oinker_imageB = document.getElementById("oinker_02");
    const oinker_imageC = document.getElementById("oinker_03");
    const oinker_imageD = document.getElementById("oinker_04");
    const oinker_comp = window.getComputedStyle( oinker_image );

    const width = Number(
      oinker_comp.getPropertyValue( 'width' ).slice(0,-2));
    const offset = Number(
      getX( oinker_image.style.transform ));



    let mod = (offset+width) + "px";
    gallery.oinker--;
    if( offset+width > 0 ) {
      mod = 0;
      gallery.oinker = 0;
    }

    const effect = "translateX(" + mod + ")";

    oinker_image.style.transform = effect;
    oinker_imageB.style.transform = effect;
    oinker_imageC.style.transform = effect;
    oinker_imageD.style.transform = effect;
  });

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


  const triviacards_next = document.getElementById("triviacards_pic_next");
  triviacards_next.addEventListener( 'click', (click) => {
    const triviacards_image = document.getElementById("triviacards_01");
    const triviacards_imageB = document.getElementById("triviacards_02");
    const triviacards_imageC = document.getElementById("triviacards_03");
    const triviacards_imageD = document.getElementById("triviacards_04");
    const triviacards_comp = window.getComputedStyle( triviacards_image );

    const width = triviacards_comp.getPropertyValue( 'width' ).slice(0,-2);
    const offset = getX( triviacards_image.style.transform );

    let mod = (offset-width) + "px";
    gallery.triviacards++;
    if( offset-width < width*-2 ) {
      mod = (width*-3) + "px";
      gallery.triviacards = 3;
    }

    const effect = "translateX(" + mod + ")";

    triviacards_image.style.transform = effect;
    triviacards_imageB.style.transform = effect;
    triviacards_imageC.style.transform = effect;
    triviacards_imageD.style.transform = effect;
  });

  const triviacards_last = document.getElementById("triviacards_pic_last");
  triviacards_last.addEventListener( 'click', (click) => {
    const triviacards_image = document.getElementById("triviacards_01");
    const triviacards_imageB = document.getElementById("triviacards_02");
    const triviacards_imageC = document.getElementById("triviacards_03");
    const triviacards_imageD = document.getElementById("triviacards_04");
    const triviacards_comp = window.getComputedStyle( triviacards_image );

    const width = Number(
      triviacards_comp.getPropertyValue( 'width' ).slice(0,-2));
    const offset = Number(
      getX( triviacards_image.style.transform ));



    let mod = (offset+width) + "px";
    gallery.triviacards--;
    if( offset+width > 0 ) {
      mod = 0;
      gallery.triviacards = 0;
    }

    const effect = "translateX(" + mod + ")";

    triviacards_image.style.transform = effect;
    triviacards_imageB.style.transform = effect;
    triviacards_imageC.style.transform = effect;
    triviacards_imageD.style.transform = effect;
  });



  window.addEventListener( 'resize', (resize) => {
    console.log( "resize" );
    if( gallery.oinker != 0 ) {
      const oinker_image = document.getElementById("oinker_01");
      const oinker_imageB = document.getElementById("oinker_02");
      const oinker_imageC = document.getElementById("oinker_03");
      const oinker_imageD = document.getElementById("oinker_04");
      const oinker_comp = window.getComputedStyle( oinker_image );

      const width = Number(
        oinker_comp.getPropertyValue( 'width' ).slice(0,-2));
      const mod = (width * gallery.oinker);
      const effect = "translateX(-" + mod + "px)";
      oinker_image.style.transform = effect;
      oinker_imageB.style.transform = effect;
      oinker_imageC.style.transform = effect;
      oinker_imageD.style.transform = effect;
    }
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
    if( gallery.triviacards != 0 ) {
      const triviacards_image = document.getElementById("triviacards_01");
      const triviacards_imageB = document.getElementById("triviacards_02");
      const triviacards_imageC = document.getElementById("triviacards_03");
      const triviacards_imageD = document.getElementById("triviacards_04");
      const triviacards_comp = window.getComputedStyle( triviacards_image );

      const width = Number(
        triviacards_comp.getPropertyValue( 'width' ).slice(0,-2));
      const mod = (width * gallery.triviacards);
      const effect = "translateX(-" + mod + "px)";
      triviacards_image.style.transform = effect;
      triviacards_imageB.style.transform = effect;
      triviacards_imageC.style.transform = effect;
      triviacards_imageD.style.transform = effect;
    }
  });
});

function getX( inValue ) {
  return inValue.slice( 11, -3 );
}
