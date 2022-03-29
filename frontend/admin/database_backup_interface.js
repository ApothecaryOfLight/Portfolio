function launch_database_backup_interface() {
  const edit_blog_interface =
    document.getElementById("edit_blog_interface");
  const error_log_container =
    document.getElementById("error_log_container");
  const edit_portfolio_interface =
    document.getElementById("edit_portfolio_interface");
  const database_backup_interface =
    document.getElementById("database_backup_interface");

  edit_blog_interface.style.display = "none";
  error_log_container.style.display = "none";
  edit_portfolio_interface.style.display = "none";
  database_backup_interface.style.display = "block";

  attach_database_events();
}

function attach_database_events() {
  detach_database_events();
  const upload = document.getElementById("upload_db");
  upload.addEventListener( 'click', upload_db );

  const download = document.getElementById("download_db");
  download.addEventListener( 'click', download_db );
}

function detach_database_events() {
  const upload_old = document.getElementById("upload_db");
  const upload_new = upload_old.cloneNode( true );
  upload_old.parentNode.replaceChild( upload_new, upload_old );

  const download_old = document.getElementById("download_db");
  const download_new = download_old.cloneNode( true );
  download_old.parentNode.replaceChild(
    download_new,
    download_old
  );
}

function upload_db() {
  const passphrase_field =
    document.getElementById("admin_passphrase");
  const passphrase = md5( passphrase_field.value );

  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText( file );
    reader.onload = readerEvent => {
      fetch(
        ip + 'upload_database',
        {
          method: 'POST',
          body: JSON.stringify({
            data: readerEvent.target.result,
            'passphrase': passphrase
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then( response => response.json() )
      .then( json => {
        if( json.result == "success" ) {
          console.log( "Upload successful!" );
        } else {
          console.log( "Unspecified error." );
        }
      });
    }
  }
  input.click();
}

function save_backup( data ) {
console.log( "save_backup" );

  //1) Create placeholder element.
  const a = document.createElement('a');

  //2) Create a file blob.
  const file = new Blob([data], {type: 'utf8'});

  a.href = URL.createObjectURL( file );
  a.download = "backup_database.sql";
  a.click();

  URL.revokeObjectURL( a.href );
}

function download_db() {
console.log( "download_db" );
  const passphrase_field =
    document.getElementById("admin_passphrase");
  const passphrase = md5( passphrase_field.value );
console.log( passphrase );
  const download_request = new Request(
    ip + 'download_database',
    {
      method: 'POST',
      body: JSON.stringify({
        'passphrase': passphrase
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  fetch( download_request )
    .then( result => result.json() )
    .then( json => {
      if( json.result == "success" ) {
        console.log( "result" );
        console.dir( json );
        save_backup( json.data );
      } else {
        console.log( "Error" );
        console.log( json.reason );
      }
    });
}
