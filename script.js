window.addEventListener( 'load', (click) => {
  const skills_button = document.getElementById("skills_button");
  skills_button.addEventListener( 'click', (click) => {
    console.log( "click" );
    const skills = document.getElementById("skills");
    console.dir( skills );
//    console.log( skills.nextSibling.style.height );
    skills.style.display = "block";
  });


  const bio_button = document.getElementById("expand_bio");
  bio_button.addEventListener( 'click', (click) => {
    console.log( "bio" );
    const bio_text = document.getElementById("bio_text");
    bio_text.style.display = "block";
  });
});
