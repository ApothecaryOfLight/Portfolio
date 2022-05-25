"use strict";


/*
Render the images in a blog post.
*/
function render_blog_images() {
  //Create a string to store the stringbashed HTML.
  let html_string = "";

  //If there are images, render them, with associated buttons and check boxes.
  if( images.length != 0 ) {
    //Iterate through the images, converting each to HTML.
    for( const index in images ) {
      html_string += "<div class=\'image_container\'>" +
        "<div class=\'image_header\'>" +
        "<input type=\'checkbox\'/>Blurb Image" +
        "</div>" +
        "<div class=\'image_body\'>" +
        "<img class=\'image_image\' " +
        "src=\'" + images[index].image_data + "\'>" +
        "<div class=\'image_tools\'>" +
        "<button class=\'image_delete\' " +
        "onclick=\'delete_blog_image(" +
        images[index].local_image_id +
        ")\' " +
        ">X</button>" +
        "<button class=\'image_copy_link\' " +
        "onclick=\'copy_link( " +
        images[index].local_image_id + ")\' " +
        ">Copy Link</button>" +
        "</div>" +
        "</div></div>";
    }
  }

  //Get a reference to the image container element.
  const image_container = document.getElementById("new_blog_images_container");

  //Assign the string-bashed HTML to the image container.
  image_container.innerHTML = html_string;
}


/*
Create an image reference to emplace in a blog post.
*/
function copy_link( inLocalID ) {
  console.log("copy link");
  console.log( inLocalID );
  //Create a string representing the image.
  const image_place_text = "[[[image=" + inLocalID + "]]]";

  //Get a reference to the blog text field.
  const body = document.getElementById("new_blog_body");

  //Insert the image link into the body text field at the text caret's position.
  body.value = body.value.substr( 0, body.selectionStart ) +
    image_place_text +
    body.value.substr( body.selectionStart, body.value.length );
}


/*
Delete an existing blog image.

inLocalID: Locally generated and stored ID of the image to delete.
*/
function delete_blog_image( inLocalID ) {
  //Iterate through the images.
  for( const image_index in images ) {
    //If this is the image to be deleted:
    if( images[image_index].local_image_id == inLocalID ) {
      //Remove this image from the array.
      images.splice( image_index, 1 );

      //Rerender the remaining images.
      render_blog_images();
    }
  }
}

/*
Global array to contain blog post images.
*/
const images = [];


/*
Function to load an image into a blog post from the user's computer.
*/
function select_image() {
  //Create a reference to an input element.
  const input = document.createElement('input');

  //Set the input element to take files.
  input.type = 'file';

  //Set the input element to accept image file types.
  input.accept = 'image/*';

  //Set the input element to accept multiple files.
  input.setAttribute("multiple","");

  //Attach an event listener to the input element.
  input.onchange = e => {
    //Iterate through each file being added.
    for( let file_index = 0; file_index < e.target.files.length; file_index++ ) {
      //Create a file reader.
      const reader = new FileReader();

      //Read the file.
      reader.readAsDataURL( e.target.files[file_index] );

      //Attach an event listener to fire once the file is fully loaded.
      reader.onload = readerEvent => {
        //Store the image now that it's processed.
        store_image( readerEvent );
      }
    };
  }

  //Trigger the input element.
  input.click();
}


/*
Function to process image data for a new blog image.
*/
function store_image( inImageData ) {
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

  //Add the image to the array of image objects.
  images.push({
    "image_data": rawImageData,
    "local_image_id": generate_temp_image_id(),
    "image_id": null
  });

  //Render the images stored in the array of image objects.
  render_blog_images();
}