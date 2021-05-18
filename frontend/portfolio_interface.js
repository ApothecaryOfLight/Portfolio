function launch_portfolio() {
  const portfolio = document.getElementById("portfolio_interface");
  const blog = document.getElementById("blog_interface");
  blog.style.display = "none";
  portfolio.style.display = "block";

  get_dynamic_portfolio();
}

function get_dynamic_portfolio() {
  const req_time = Date.now();
  const portfolio_request = new Request(
    ip + "get_portfolio"
  );
  fetch( portfolio_request )
    .then( response => response.json() )
    .then( json => {
      const rec = Date.now();
      console.log( "Fetch took: " + (rec - req_time) + "ms" );
      render_dynamic_portfolio(
        json.portfolio_data,
        json.portfolio_images
      );
    });
}

function render_dynamic_portfolio( portfolioData, image_data ) {
console.log( "render_dynamic_portfolio" );
  let dynamic_portfolio_string = "";
  for( index in portfolioData ) {
    dynamic_portfolio_string +=
      compose_project( portfolioData[index], image_data );
  }
  const dynamic_portfolio_dom_element =
    document.getElementById("dynamic_project_container");
  dynamic_portfolio_dom_element.innerHTML =
    dynamic_portfolio_string;
  attach_scroll_buttons( portfolioData, image_data );
}

/*Though inexpensive in terms of computing power
because of the small set size, this is very inefficient
and should be soon improved upon.*/
function has_multiple_images( imageData, id ) {
  let counter = 0;
  for( index in imageData ) {
    if( imageData[index].portfolio_entry_id == id ) {
      counter++;
    }
  }
  if( counter > 1 ) {
    return true;
  } else {
    return false;
  }
}

function compose_project( projectData, imageData ) {
  const title = projectData.portfolio_title;
  let project_string = "<div class=\'project_container\'>" +
    "<div class=\'pictures_container\' " +
    "style=\'width:640px\'" +
    ">";

  const id = projectData.portfolio_entry_id;

  if( has_multiple_images( imageData, id ) ) {
    project_string += "<button id=\'" + title + "_pic_last\' " +
      "class=\'pic_last\'>\<</button>"  +
      "<button id=\'" + title + "_pic_next\' " +
      "class=\'pic_next\'>\></button>";
  }
  project_string += "<div id=\'" + title + "_scroll\'" +
    " class=\'scroll\'" +
    ">";

  let counter = 0;
  for( index in imageData ) {
    if(
      imageData[index].portfolio_entry_id ==
      projectData.portfolio_entry_id
    ) {
      project_string += "<img id=\'" +
        title + "_" + counter +
        "\'" +
        " src=\'" + imageData[index].image_data + "\'" +
        " class=\'image\'/>";
      counter++;
    }
  }

  project_string += "</div></div>";

  project_string += "<div class=\'description_container\'>" +
    "<div class=\'title_text\'>" + title + "</div>";

  project_string += "<div class=\'github_link\'>" +
    "<a href=\'" +
    projectData.github_link + "\'>" +
    "Github Page" + "</a></div><br>";

  project_string += "<div class=\'live_link\'>" +
    "<a href=\'" +
    projectData.live_page + "\'>" +
    "Live Page</a></div><br>";

  project_string += "<div class=\'description_text\'>" +
    projectData.portfolio_text + "</div>";

  project_string += "<div class=\'icon_container\'>" +
    projectData.portfolio_flags + "</div>";

  project_string += "</div></div></div>";
  return project_string;
}

async function get_gallery_images( gallery_name ) {

}

async function render_gallery_images( gallery_name ) {

}

function attach_scroll_buttons( inPortfolioData, inImageData ) {
  for( index in inPortfolioData ) {
    attach_scroll_listeners(
      inPortfolioData[index],
      inImageData
    );
  }
}

const gallery = {};

function getX( inValue ) {
  return inValue.slice( 11, -3 );
}

function attach_scroll_listeners( inProjectData, inImageData ) {
  const id = inProjectData.portfolio_entry_id;
  if( !has_multiple_images( inImageData, id ) ) {
    return;
  }

  const title = inProjectData.portfolio_title;
  const next_name = title + "_pic_next";
  const prev_name = title + "_pic_last";
  const next_btn = document.getElementById( next_name );
  const prev_btn = document.getElementById( prev_name );

  const image_refs = [];
  const image_names = [];
  let counter = 0;
  for( let image_index in inImageData ) {
    const project_id = inImageData[image_index].portfolio_entry_id;
    if( project_id == inProjectData.portfolio_entry_id ) {
      image_refs.push( inImageData[image_index] );
      image_names.push( title + "_" + counter );
      counter++;
    }
  }

  gallery[ title ] = 0;

  const image_elements = [];
  for( name_index in image_names ) {
    image_elements.push(
      document.getElementById( image_names[name_index] )
    );
  }

  next_btn.addEventListener( 'click', (click) => {
    const comp = window.getComputedStyle( image_elements[0] );
    const width = comp.getPropertyValue('width').slice(0,-2);
    const offset = getX( image_elements[0].style.transform );

    const limit = (image_elements.length - 1)*-1;

    let mod = (offset-width) + "px";
    gallery[title]++;

    if( gallery[title] > image_elements.length-1 ) {
      mod = (width*limit) + "px";
      gallery[title] = image_elements.length-1;
    }


    const effect = "translateX(" + mod + ")";
    for( let index in image_elements ) {
      image_elements[index].style.transform = effect;
    }

  });

  prev_btn.addEventListener( 'click', (click) => {
    const comp = window.getComputedStyle( image_elements[0] );
    const width = Number(
      comp.getPropertyValue( 'width' ).slice( 0, -2 )
    );
    const offset = Number(
      getX( image_elements[0].style.transform )
    );

    let mod = (offset+width) + "px";
    gallery[title]--;
    if( offset+width > 0 ) {
      mod = 0;
      gallery[title] = 0;
    }

    const effect = "translateX(" + mod + ")";
    for( let index in image_elements ) {
      image_elements[index].style.transform = effect;
    }
  });
}
