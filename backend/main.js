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
      function( error_obj ) {
        if( error_obj ) {
          throw error_obj;
        }
      }
    );
    res.send( JSON.stringify({"stop":"sure"}) );
  } catch(error_obj) {
    await error.log(
      "main.js:app.post:contact_me",
      error_obj
    );
  }
});

app.get( '/get_errors', async function(req,res) {
  try {
    const errors = await error.get_log();
    res.send({
      error_log: errors
    });
  } catch(error_obj) {
    await error.log(
      "main.js:app.get:error_log",
      error_obj
    );
  }
});

app.get( '/get_blog_page/:page', async function(req,res) {
  try {
    if( req.params.page == 1 ) {
      //1) Get the 5 most recent posts
      const recent_posts = "SELECT " +
        "title, timestamp, body " +
        "FROM blog_posts " +
        "ORDER BY timestamp DESC " +
        "LIMIT 5";
      const [rec_row,rec_field] =
        await sqlPool.query( recent_posts );

      //2) Get 3 of the most recently updated posts by root
      const recent_roots = "SELECT " +
        "A.title, A.timestamp, A.body " +
        "FROM blog_posts A " +
        "INNER JOIN blog_posts B " +
        "ON A.root_id = B.post_id " +
        "WHERE B.root_id IS NULL " +
        "ORDER BY A.timestamp "
        "LIMIT 5;";
      const [roots_row,roots_field] =
        await sqlPool.query( recent_roots );
      //3) Combine them.
      const blog_posts_obj = {
        "recent_posts": rec_row,
        "root_posts": roots_row,
        "page": 1
      };
      //4) Return them.
      res.send( JSON.stringify({
        "result": "success",
        "blog_posts": blog_posts_obj
      }));
    } else {
      //1) Get the 8 most recently updated posts by root.
      const offset = 5 + (req.params.page-1)*8;
      const paginated_posts = "SELECT " +
        "curr.title, curr.timestamp, curr.body " +
        "root.title, root.post_id " +
        "FROM blog_posts curr " +
        "INNER JOIN blog_posts root " +
        "ON curr.root_id = root.post_id " +
        "ORDER BY timestamp DESC " +
        "LIMIT " + offset + ",8);";
      const [page_row,page_field] =
        await sqlPool.query( paginated_posts );

      //2) Return them.
      res.send( JSON.stringify({
        "result": "success",
        "blog_posts": {
          "recent_posts": page_row,
          "page": req.params.page
        }
      }));
    }
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_blog_page",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.get( '/page_count', async function(req,res) {
  try {
    const page_count_query = "SELECT COUNT(post_id) as post_count " +
      "FROM blog_posts;";
    const [count_row,count_field] =
      await sqlPool.query( page_count_query );
    res.send( JSON.stringify({
      "result": "success",
      "post_count": count_row[0].post_count
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_page_count",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.post( '/new_blog_post', async function(req,res) {
  try {
    const timestamp = error.get_timestamp();
    const new_post_id_query = "SELECT " +
      "Portfolio.generate_new_id( 1 ) as new_id;";
    const [new_id_row,new_id_field] =
      await sqlPool.query( new_post_id_query );
    const new_blog_post_id = new_id_row[0].new_id;

    //Get the root id.
    let root_id;
    if( req.body.root == -1 ) {
      root_id = "NULL";
    } else {
      root_id = req.body.root;
    }

    //Get a blog image ID for each image.
    for( index in req.body.images ) {
      const new_image_id_query = "SELECT " +
        "Portfolio.generate_new_id( 2 ) as new_image_id;";
      const [new_image_id_row,new_image_id_field] =
        await sqlPool.query( new_image_id_query );
      req.body.images[index].image_id =
        new_image_id_row[0].new_image_id;
    }

    let new_blog_post_query = "INSERT INTO blog_posts " +
      "(title, body, timestamp, root_id, postorder, post_id) " +
      "VALUES ( " +
      "\'" + req.body.title + "\', " +
      "\'" + req.body.body + "\', " +
      "\'" + timestamp + "\', " +
      root_id + "," +
      "0, " +
      new_blog_post_id + " ); ";

    for( index in req.body.images ) {
      new_blog_post_query += "INSERT INTO blog_images " +
        "( image_id, local_image_id, post_id, image_data ) " +
        "VALUES " +
        " ( " + req.body.images[index].image_id + ", " +
        req.body.images[index].temp_image_id + ", " +
        new_blog_post_id + ", \'" +
        req.body.images[index].image_data + "\' ); "
    }

    const [new_blog_post_row,new_blog_post_field] =
      await sqlPool.query( new_blog_post_query );
    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.post:new_blog_page",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.post( '/edit_blog_post', async function(req,res) {
  try {
    let root_id;
    if( req.body.root == -1 ) {
      root_id = "NULL";
    } else {
      root_id = req.body.root;
    }

    const update_query = "UPDATE blog_posts " +
      "SET title = \'" + req.body.title + "\', " +
      "body = \'" + req.body.body + "\', " +
//      "SET updated_timestamp = " + req.body.timestamp +
      "root_id = " + root_id + ", " +
      "postorder = 0 " + " " +
      "WHERE post_id = " + req.body.post_id + ";"
    const [update_row,update_field] =
      await sqlPool.query( update_query );

    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.post:edit_blog_page",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.get( '/get_blog_images/:post_id', async function(req,res) {
  try {
    const get_images_query = "SELECT " +
      "image_data, alt_text, image_id, local_image_id " +
      "FROM blog_images " +
      "WHERE post_id = " + req.params.post_id +
      ";"
    const [images_row,images_field] =
      await sqlPool.query( get_images_query );
console.log( images_row.length );
    res.send( JSON.stringify({
      "result": "success",
      "images_data": images_row
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.post:get_blog_images",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.get( '/get_root_posts', async function(req,res) {
  try {
    const query_roots = "SELECT title, post_id " +
      "FROM blog_posts " +
      "WHERE root_id IS NULL;"
    const [roots_row,roots_field] =
      await sqlPool.query( query_roots );
    res.send( JSON.stringify({
      "result": "success",
      "roots": roots_row
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_root_posts",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.get( '/get_existing_posts', async function(req,res) {
  try {
    const query_existing = "SELECT title, post_id " +
      "FROM blog_posts";
    const [existing_row,existing_field] =
      await sqlPool.query( query_existing );
    res.send( JSON.stringify({
      "result": "success",
      "existing": existing_row
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_existing_posts",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

app.get( '/get_blog_post/:post_id', async function(req,res) {
  try {
    const get_post = "SELECT " +
      "title, body, timestamp, post_id, root_id, postorder " +
      "FROM blog_posts " +
      "WHERE post_id = " + req.params.post_id + ";";
    const [post_row,post_field] = await sqlPool.query( get_post );
    res.send( JSON.stringify({
      "result": "success",
      "post_data": post_row[0]
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_blog_post",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

if( process.argv[2] == "https" ) {
  server.listen( 3000 );
} else {
  app.listen( 3000 );
}

