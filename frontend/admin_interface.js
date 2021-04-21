window.addEventListener( 'load', (window_loaded) => {
  console.log( "All loaded!" );
  get_errors();
});

function get_errors() {
  const get_errors_request = new Request(
    ip + 'get_errors'
  );
  fetch( get_errors_request )
    .then( json => json.json() )
    .then( json => {
      console.dir( json );
    });
}
