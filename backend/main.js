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
var privateKey;
var certificate;
var credentials;

if( process.argv[2] == "https" ) {
  privateKey = file_stream.readFileSync('/home/ubuntu/Portfolio/privkey.pem');
  certificate = file_stream.readFileSync('/home/ubuntu/Portfolio/fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
  server = https.createServer( credentials, app );
}

/*MySQL*/
const mysql = require('mysql2');
const sqlPool = mysql.createPoolPromise({
  host: 'localhost',
  user: 'Portfolio_User',
  password: 'Portfolio_Password',
  database: 'Portfolio',
  connectionLimit: 50,
  multipleStatements: true
});

/*Error Logging*/
const error = require('./error_logging.js');

app.post( '/contact_me', async function( req,res ) {
  try {
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
  } catch(error) {
    error.log(
      "main.js:app.post:contact_me",
      error
    );
  }
});

app.get( '/get_errors', async function(req,res) {
  try {
    const errors = await error.get_log();
    res.send({
      error_log: errors
    });
  } catch(error) {
    error.log(
      "main.js:app.get:error_log",
      error
    );
  }
});

app.get( '/get_blog_page/:page', async function(req,res) {
console.dir( req.params );
  try {
    if( req.params.page == 1 ) {
      //1) Get the 5 most recent posts
      const recent_posts = "SELECT " +
        "title, timestamp, body " +
        "FROM blog_posts " +
        "ORDER BY timestamp DESC " +
        "LIMIT 5";
console.log( recent_posts );
      const [rec_row,rec_field] =
        await sqlPool.query( recent_posts );

      //2) Get 3 of the most recently updated posts by root
      const recent_roots = "SELECT " +
        "title, timestamp, body " +
        "FROM blog_posts " +
        "WHERE is_root = FALSE " +
        "AND root_id <> ANY ( " +
        "SELECT DISTINCT root_id FROM blog_posts " +
        "ORDER BY timestamp DESC " +
        "LIMIT 5)";
console.log( recent_roots );
      const [roots_row,roots_field] =
        await sqlPool.query( recent_roots );
      //3) Combine them.

      //4) Return them.
      

    } else {
      //1) Get the 8 most recently updated posts by root.
    }

    res.send( JSON.stringify({
      "result": "failure",
      "reason": "Unknown error 001."
    }));
  } catch( error ) {
    error.log(
      "main.js:app.get:get_blog_page",
      error
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error
    }));
  }
});

if( process.argv[2] == "https" ) {
  server.listen( 3000 );
  error.log( "main.js", "Servering listening HTTPS!" );
} else {
  app.listen( 3000 );
  error.log( "main.js", "Servering listening HTTP!" );
}

