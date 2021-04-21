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
const file_stream = require('fs');

/*HTTPS*/
var https = require('https');
var privateKey = file_stream.readFileSync('/home/ubuntu/Portfolio/privkey.pem');
var certificate = file_stream.readFileSync('/home/ubuntu/Portfolio/fullchain.pem');
var credentials = {key: privateKey, cert: certificate};
var server = https.createServer( credentials, app );

/*MySQL*/
const mysql = require('mysql2');
const sqlPool = mysql.createPoolPromise({
  host: 'localhost',
  user: 'Flashcards_User',
  password: 'Flashcards_Password',
  database: 'Flashcards',
  connectionLimit: 45,
  multipleStatements: true
});

/*Error Logging*/
const error_log = require('./error_logging.js');

app.post( '/contact_me', async function( req,res ) {
  console.dir( req.body );
//  console.log( req.body.test );
  const text =
    "name: " + req.body.name + "\n" +
    "org: " + req.body.org + "\n" +
    "phone: " + req.body.phone + "\n" +
    "email: " + req.body.email + "\n" +
    "message: " + req.body.msg + "\n\n\n";
  file_stream.appendFile(
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

server.listen( 3000 );
//app.listen( 3000 );
