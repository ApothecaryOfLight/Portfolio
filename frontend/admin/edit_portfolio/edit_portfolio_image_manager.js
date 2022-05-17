"use strict";


/*
Global array to hold portfolio images.
*/
const portfolio_images = [];


/*
Function to add a portfolio image.
*/
function portfolio_add_image() {
  portfolio_select_image();
}


/*
Function to load a portfolio image from the user's computer.
*/
function portfolio_select_image() {
  //Create an input element.
  const input = document.createElement('input');

  //Set the input element attributes to work with image files.
  input.type = 'file';
  input.accept = 'image/*';

  //Attach an event listener to the input element.
  input.onchange = e => {
    //Get a reference to the selected file.
    const file = e.target.files[0];

    //Create a file reader.
    const reader = new FileReader();

    //Read in the file.
    reader.readAsDataURL( file );

    //Attach an event listener that will fire upon the image being loaded.
    reader.onload = readerEvent => {
      //Add the loaded image to the image gallery.
      portfolio_add_image_to_gallery( readerEvent );
    }
  }

  //Trigger the onchange event above.
  input.click();
}


/*
Function to process a new portfolio image.
*/
function portfolio_add_image_to_gallery( inImageData ) {
  //Get size.
  const size = inImageData.total/1000000;
  if( size > 15 ) {
    alert( "Image too large!" );
    return;
  }

  //Get MIME type.
  const mime_type = inImageData.srcElement.result.substr(
    5,
    inImageData.srcElement.result.indexOf(";")-5
  );

  //Get the image data.
  const content = inImageData.target.result;
  const pos = inImageData.target.result.indexOf( "," );
  const data = content.substr( pos+1 );

  //Compose raw data string.
  const rawImageData = "data:" + mime_type + ";base64," + data;

  //Add the image to the portfolio_images global object.
  portfolio_images.push({
    "image_data": rawImageData,
    local_image_id: generate_new_local_id()
  });

  //Render the image gallery.
  render_portfolio_image_gallery();
}



/*
Function to delete an image from the gallery.
*/
function delete_image_from_gallery( id, local_id ) {
  //Iterate through every portfolio image.
  for( const index in portfolio_images ) {
    //If an ID is provided, then:
    if( id ) {
      //If the image to delete has the same ID, then:
      if( portfolio_images[index].image_id == id ) {
        //Remove the image from the array.
        portfolio_images.splice( index, 1 );

        //Render the remaining elements.
        render_portfolio_image_gallery();
      }
    } else {
      //Otherwise, we need to only delete the image locally.
      if( portfolio_images[index].local_image_id == local_id ) {
        //Remove the image from the array.
        portfolio_images.splice( index, 1 );

        //Render the remaining elements.
        render_portfolio_image_gallery();
      }
    }
  }
}