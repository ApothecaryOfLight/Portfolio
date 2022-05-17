"use strict";


/*
Function to attach scroll buttons to an image gallery.

inPortfolioData: Project (text) data.

inImageData: Image data.
*/
function attach_scroll_buttons( inPortfolioData, inImageData ) {
  //Iterate through each projec in the portfolio.
  for( const index in inPortfolioData ) {
    //Attach scroll buttons to each image gallery.
    attach_scroll_listeners(
      inPortfolioData[index],
      inImageData
    );
  }
}
  
  
  /*
  Global object containing portfolio image gallery information.
  */
  const gallery = {};
  
  
/*
Function to get the transformX numerical value by discarding the letters and parentheses.

inValue: transformX([desired_value]px). We need to extract the [desired_value].
*/
function getX( inValue ) {
  //Return the pixel value by removing the first 11 and last 3 characters.
  return inValue.slice( 11, -3 );
}
  
  
/*
Function to attach event listeners to the image gallery scroll buttons.

inProjectData: Project data (text).

inImageData: Images to fill this project's image gallery.
*/
function attach_scroll_listeners( inProjectData, inImageData ) {
  //Get the ID of this project.
  const id = inProjectData.portfolio_entry_id;

  //If this gallery only has one image, then end the function.
  if( !has_multiple_images( inImageData, id ) ) {
    return;
  }

  //Get the title of the project.
  const title = inProjectData.portfolio_title;

  //Create the names of the next and previous buttons.
  const next_name = title + "_pic_next";
  const prev_name = title + "_pic_last";

  //Get references to the next and previous buttons.
  const next_btn = document.getElementById( next_name );
  const prev_btn = document.getElementById( prev_name );

  //Iterate through each image, remembering a reference and name for each.
  const image_refs = [];
  const image_names = [];
  let counter = 0;
  for( const image_index in inImageData ) {
    const project_id = inImageData[image_index].portfolio_entry_id;
    if( project_id == inProjectData.portfolio_entry_id ) {
      image_refs.push( inImageData[image_index] );
      image_names.push( title + "_" + counter );
      counter++;
    }
  }

  //Set the current scroll position to 0.
  gallery[ title ] = 0;

  //Get the element IDs of each image.
  const image_elements = [];
  for( const name_index in image_names ) {
    image_elements.push(
      document.getElementById( image_names[name_index] )
    );
  }

  //Attach a click event listener to the next button.
  next_btn.addEventListener( 'click', (click) => {
    //Get the width of the images after CSS scaling has been applied.
    const comp = window.getComputedStyle( image_elements[0] );
    const width = comp.getPropertyValue('width').slice(0,-2);
    const offset = getX( image_elements[0].style.transform );

    //Get the maximum amount of scroll.
    const limit = (image_elements.length - 1)*-1;

    //Get the amount of scroll applied.
    let mod = (offset-width) + "px";

    //Increment the scroll position.
    gallery[title]++;

    //If the scroll is already maxed out:
    if( gallery[title] > image_elements.length-1 ) {
      //Set the scroll to max.
      mod = (width*limit) + "px";

      //Decrement the scroll position.
      gallery[title] = image_elements.length-1;
    }

    //String bash the CSS property for smooth scrolling in the image gallery.
    const effect = "translateX(" + mod + ")";
    //Apply the translate X CSS property to every image in the gallery.
    for( let index in image_elements ) {
      image_elements[index].style.transform = effect;
    }
  });

  //Attach a click event listener to the previous button.
  prev_btn.addEventListener( 'click', (click) => {
    //Get the width of the image gallery after CSS scaling has been applied.
    const comp = window.getComputedStyle( image_elements[0] );
    const width = Number(
      comp.getPropertyValue( 'width' ).slice( 0, -2 )
    );
    const offset = Number(
      getX( image_elements[0].style.transform )
    );

    //Get the current scroll value.
    let mod = (offset+width) + "px";

    //Decrement the gallery scroll position.
    gallery[title]--;

    //If the gallery is scrolled all the way to the left, set the scroll to 0.
    if( offset+width > 0 ) {
      mod = 0;
      gallery[title] = 0;
    }

    //Create the CSS property to apply a smooth scroll.
    const effect = "translateX(" + mod + ")";

    //Apply the CSS property to each image in the gallery.
    for( let index in image_elements ) {
      image_elements[index].style.transform = effect;
    }
  });

  //Attach an event listener for window resizing.
  window.addEventListener('resize', (resize_event) => {
    //Iterate through every image in every gallery.
    image_elements.forEach( (image_dom) => {
      //If this image has a transform value (this gallery has been scrolled), then:
      if( image_dom.style.transform ) {
        //Get the new post-CSS applied width of the newly scaled image.
        const comp = window.getComputedStyle( image_dom );
        const width = Number(
          comp.getPropertyValue( 'width' ).slice( 0, -2 )
        );

        //Calculate the new transform position based on the width of the image and
        //the position of the scroll index (how far the gallery has been scrolled).
        const mod = (-1*(width * gallery[title])) + "px";

        //Apply the new position.
        const effect = "translateX(" + mod + ")";
        image_dom.style.transform = effect;
      }
    });
  });
}