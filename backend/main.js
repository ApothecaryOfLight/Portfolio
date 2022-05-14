"use strict";

/* Express */
const express = require('express');
const app = express();

/*CORS*/
const cors = require('cors');
app.use(cors());

/*Body data*/
const body_parser = require('body-parser');
app.use( body_parser.json({limit:'4MB'}) );

/*File system*/
const file_stream = require('fs');

/*HTTPS*/
var https = require('https');
var privateKey;
var certificate;
var credentials;

/*DB Backup*/
const {exec} = require("child_process");

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

/*Contact Me*/
const contact_me = require('./javascript/contact_me.js');

/*Admin*/
const admin = require('./javascript/admin.js');

/*Blog View*/
const blog_view = require('./javascript/blog_view.js');

/*Blog Edit*/
const blog_edit = require('./javascript/blog_edit.js');

/*Portfolio View*/
const portfolio_view = require('./javascript/portfolio_view.js');

/*Portfolio Edit*/
const portfolio_edit = require('./javascript/portfolio_edit.js');


contact_me.attach_route_contact_me( app );

admin.attach_route_get_errors( app );

blog_view.attach_route_get_blog_page( app, sqlPool );
blog_view.attach_route_page_count( app, sqlPool );

blog_edit.attach_route_new_blog_post( app, sqlPool );
blog_edit.attach_route_delete_post( app, sqlPool );
blog_edit.attach_route_edit_blog_post( app, sqlPool );
blog_edit.attach_route_get_blog_images_post_id( app, sqlPool );
blog_edit.attach_route_get_root_posts( app, sqlPool );
blog_edit.attach_get_existing_posts( app, sqlPool );
blog_edit.attach_route_get_blog_post_post_id( app, sqlPool );

portfolio_view.attach_route_get_portfolio( app, sqlPool );

portfolio_edit.attach_route_get_portfolio_entries( app, sqlPool );
portfolio_edit.attach_route_add_portfolio_entry( app, sqlPool );
portfolio_edit.attach_route_get_portfolio_entry( app, sqlPool );
portfolio_edit.delete_entity( app, sqlPool );

if( process.argv[2] == "https" ) {
  console.log( "Launching production server..." );
  privateKey = file_stream.readFileSync('../privkey.pem');
  certificate = file_stream.readFileSync('../fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
  server = https.createServer( credentials, app );
  server.listen( 3005 );
} else if( process.argv[2] == "http" ) {
  console.log( "Launching dev server..." );
  app.listen( 3005 );
}