function create_gallery_image_overlay( image_container_ref, image_ref ) {
    const overlay = document.createElement("div");
    overlay.classList = "blog_edit_gallery_image_control_overlay";
  
    const delete_button = document.createElement("div");
    delete_button.classList = "blod_edit_gallery_image_control_overlay_button";
    delete_button.textContent = "X";
    delete_button.onclick = () => {
      image_container_ref.remove();
    }
    overlay.appendChild( delete_button );
  
    const emplace_button = document.createElement("div");
    emplace_button.classList = "blod_edit_gallery_image_control_overlay_button";
    emplace_button.textContent = "<-";
    emplace_button.onclick = () => {
      const image_element = document.createElement("img");
      image_element.src = image_ref.src;
      image_element.classList = "emplaced_image";
  
      const myEditField = document.getElementById("myInput");
      myEditField.appendChild( image_element );
    }
    overlay.appendChild( emplace_button );
  
    return overlay;
  }