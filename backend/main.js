/* Express */
const express = require('express');
const app = express();

/*CORS*/
const cors = require('cors');
app.use(cors());

/*Body data*/
const body_parser = require('body-parser');
app.use( body_parser.json() );

/*File system*/
const file_system = require('fs');

app.post( '/contact_me', async function( req,res ) {
  console.dir( req.body );
//  console.log( req.body.test );
  const text =
    "name: " + req.body.name + "\n" +
    "org: " + req.body.org + "\n" +
    "phone: " + req.body.phone + "\n" +
    "email: " + req.body.email + "\n" +
    "message: " + req.body.msg + "\n\n\n";
  file_system.appendFile(
    "contact_me.txt",
    text,
    function( error ) {
      if( error ) {
        throw error;
      }
    }
  );
  res.send( JSON.stringify({"stop":"sure"}) );
});

app.listen( 3000 );
