"use strict";

function get_image_ref( image_id, images ) {
  for( let i=0; i<images.length; i++ ) {
    if( image_id == images[i].image_id ) {
      return images[i];
    }
  }
}