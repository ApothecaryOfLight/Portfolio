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
        "title, timestamp, body, post_id " +
        "FROM blog_posts " +
        "ORDER BY timestamp DESC " +
        "LIMIT 5";
      const [rec_row,rec_field] =
        await sqlPool.query( recent_posts );

      //2) Get 3 of the most recently updated posts by root
      const recent_roots = "SELECT " +
        "A.title, A.timestamp, A.body, A.post_id " +
        "FROM blog_posts A " +
        "INNER JOIN blog_posts B " +
        "ON A.root_id = B.post_id " +
        "WHERE B.root_id IS NULL " +
        "ORDER BY A.timestamp "
        "LIMIT 5;";
      const [roots_row,roots_field] =
        await sqlPool.query( recent_roots );

      //3) Get the images for the posts.
      const recent_post_ids = [];
      let recent_post_where_predicate = "";
      for( index in rec_row ) {
        recent_post_ids.push( rec_row[index].post_id );
        recent_post_where_predicate += rec_row[index].post_id;
        if( index < rec_row.length-1 ) {
          recent_post_where_predicate += " OR post_id = ";
        }
      }
      const recent_post_images_query = "SELECT " +
        "image_id, local_image_id, image_data, post_id " +
        "FROM blog_images " +
        "WHERE post_id = " +
        recent_post_where_predicate + ";";
      const [recent_images_row,recent_images_fields] =
        await sqlPool.query( recent_post_images_query );


      const recent_roots_ids = [];
      let recent_roots_where_predicate = "";
      for( index in roots_row ) {
        recent_roots_ids.push( roots_row[index].post_id );
        recent_roots_where_predicate += roots_row[index].post_id;
        if( index < roots_row.length-1 ) {
          recent_roots_where_predicate += " OR post_id = ";
        }
      }
      const recent_roots_images_query = "SELECT " +
        "image_id, local_image_id, image_data, post_id " +
        "FROM blog_images " +
        "WHERE post_id = " +
        recent_roots_where_predicate + ";";
      const [roots_images_row,roots_images_fields] =
        await sqlPool.query( recent_roots_images_query );

      //4) Combine them.
      const blog_posts_obj = {
        "recent_posts": rec_row,
        "root_posts": roots_row,
        "page": 1,
        "recent_posts_images": recent_images_row,
        "root_posts_images": roots_images_row
      };

      //5) Return them.
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
        req.body.images[index].local_image_id + ", " +
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

app.get( '/delete_post/:post_id', async function(req,res) {
  try {
    const delete_query = "DELETE FROM blog_posts " +
      "WHERE post_id = " + req.params.post_id + ";";
    const [del_row,del_field] =
      await sqlPool.query( delete_query );
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


/*Portfolio*/
app.get( '/get_portfolio_entries', async function(req,res) {
  try {
    const get_portfolio_entries = "SELECT " +
      "portfolio_title, portfolio_entry_id " +
      "FROM portfolio_entries;";
    const [entries_rows,entries_fields] =
      await sqlPool.query( get_portfolio_entries );
    res.send( JSON.stringify({
      "result": "success",
      "portfolio_entries": entries_rows
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_portfolio_entries",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

//TODO: Put all of these queries into a single transaction
app.post( '/add_portfolio_entry', async function(req,res) {
  try {
    //1) Get the portfolio entry ID (or generate new one).
    let new_entity_id;
    if( !req.body.portfolio_entry_id ) {
      const get_portfolio_id = "SELECT " +
        "Portfolio.generate_new_id( 3 ) as new_id;";
      const [new_id_row,new_id_field] =
        await sqlPool.query( get_portfolio_id );
      new_entity_id = new_id_row[0].new_id;
    } else {
      new_entity_id = req.body.portfolio_entry_id;
    }


    //2) Add or update the portfolio entity itself.
    if( req.body.portfolio_entry_id ) {
      const update_portfolio_entry_query = "UPDATE " +
        "portfolio_entries SET " +
        "portfolio_title = \'" + req.body.title + "\', " +
        "portfolio_text = \'" + req.body.description + "\', " +
        "portfolio_flags = \'" + req.body.flags + "\', " +
        "github_link = \'" + req.body.github + "\', " +
        "live_page = \'" + req.body.live_page + "\' " +
        "WHERE portfolio_entry_id = " +
        req.body.portfolio_entry_id + ";";
      const [update_row,update_field] =
        await sqlPool.query( update_portfolio_entry_query );
    } else {
      const add_portfolio_entry_query = "INSERT INTO " +
        "portfolio_entries " +
        "(portfolio_entry_id, portfolio_title, " +
        "portfolio_text, portfolio_flags, " +
        "github_link, live_page) " +
        "VALUES " +
        "( " +
        new_entity_id + ", " +
        "\'" + req.body.title + "\', " +
        "\'" + req.body.description + "\', " +
        "\'" + req.body.flags + "\', " +
        "\'" + req.body.github + "\', " +
        "\'" + req.body.live_page + "\');";
      const [add_entry_row,add_entry_field] =
        await sqlPool.query( add_portfolio_entry_query );
    }
//TODO: If images have been removed, delete them.
//TODO: Compress local_image_ids

    const images_to_delete = [];
    const images_to_add = [];
    const check_local_image_id_query = "SELECT " +
      "local_image_id " +
      "FROM portfolio_images " +
      "WHERE portfolio_entry_id = " +
      new_entity_id + ";";
    const [local_rows,local_fields] =
      await sqlPool.query( check_local_image_id_query );

    const max_image_id_query = "SELECT " +
      "MAX( local_image_id ) as max_local_image_id " +
      "FROM portfolio_images " +
      "WHERE portfolio_entry_id = " +
      new_entity_id + ";";
    const [max_row,max_field] =
      await sqlPool.query( max_image_id_query );
    const max_local_image_id =
      max_row[0].max_local_image_id ?? 0;
    for( index in req.body.images ) {
      const image_ref = req.body.images[index];
      if( !local_rows.includes( image_ref.local_image_id ) ) {
        if( image_ref.local_image_id < max_local_image_id ) {
          images_to_delete.push( image_ref.local_image_id );
        } else {
          images_to_add.push({
            "local_image_id": image_ref.local_image_id,
            "image_data": image_ref.image_data
          });
        }
      }
    }

    //) Delete images that have been removed.
    if( images_to_delete.length > 0 ) {
      let delete_image_predicate = "(";
      for( indexC in images_to_delete ) {
        delete_image_predicate +=
          "local_image_id = " +
          images_to_delete[indexC];
        if( indexC < images_to_delete.length ) {
          delete_image_predicate += " OR ";
        }
      }
      delete_image_predicate += ") "
      const delete_images_query = "DELETE FROM " +
        "portfolio_images " +
        "WHERE portfolio_entry_id = " +
        new_entity_id + " AND " +
        delete_image_predicate + ";";
      const [del_row,del_field] =
        await sqlPool.query( delete_images_query );
    }

    //) Insert the new images.
    if( images_to_add.length > 0 ) {
      let insert_image_values = "VALUES ";
      for( index in images_to_add ) {
        insert_image_values += "( " +
          "(SELECT Portfolio.generate_new_id(4)), " +
          images_to_add[index].local_image_id + ", " +
          new_entity_id + ", " +
          "\'" +
          images_to_add[index].image_data +
          "\' " +
          "), ";
      }
      insert_image_values = insert_image_values.substr(
        0,
        insert_image_values.length-2
      );
      const insert_images_query = "INSERT INTO " +
        "portfolio_images " +
        "(image_id, local_image_id, " +
        "portfolio_entry_id, image_data ) " +
        insert_image_values + ";";
      const [insert_row,insert_field] =
        await sqlPool.query( insert_images_query );
    }

    //) Compress the local_image_ids to ensure consistency.
    const query_local_image_ids = "SELECT " +
      "local_image_id FROM portfolio_images " +
      "WHERE portfolio_entry_id = " + new_entity_id + ";";
console.log( query_local_image_ids );
    const [locals_row,locals_field] =
      await sqlPool.query( query_local_image_ids );
    for( index in locals_row ) {
      const update_query = "UPDATE portfolio_images " +
        "SET local_image_id = " + index + " " +
        "WHERE local_image_id = " +
        locals_row[index].local_image_id + " " +
        "LIMIT 1" +
        ";";
      const [upd_row,upd_field] =
        await sqlPool.query( update_query );
    }


    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error_obj ) {
    const error_message = error_obj.toString();
    await error.log(
      "main.js:app.post:add_portfolio_entry",
      error_message
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_message
    }));
  }
});

app.get(
  '/get_portfolio_entry/:portfolio_entity_id',
  async function(req,res) {
  try {
    //1) Get portfolio entity
    const get_portfolio_entry_query = "SELECT " +
      "portfolio_entry_id, portfolio_title, " +
      "portfolio_text, portfolio_flags, github_link, " +
      "live_page " +
      "FROM portfolio_entries " +
      "WHERE portfolio_entry_id = " +
      req.params.portfolio_entity_id + ";";
    const [entry_row,entry_field] =
      await sqlPool.query( get_portfolio_entry_query );

    //2) Get portfolio images
    const get_portfolio_images_query = "SELECT " +
      "image_data, image_id, local_image_id " +
      "FROM portfolio_images " +
      "WHERE portfolio_entry_id = " +
      req.params.portfolio_entity_id + ";";
    const [image_rows,image_fields] =
      await sqlPool.query( get_portfolio_images_query );

    res.send( JSON.stringify({
      "result": "success",
      "portfolio_entry": entry_row[0],
      "images": image_rows
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_portfolio_entry",
      error_obj
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj
    }));
  }
});

//TODO: Cache this response on startup until it is updated.
app.get( '/get_portfolio', async function(req,res) {
  try {
    const get_portfolio_query = "SELECT " +
      "portfolio_entry_id, portfolio_title, " +
      "portfolio_text, portfolio_flags, github_link, " +
      "live_page " +
      "FROM portfolio_entries;";
    const [port_rows,port_fields ] =
      await sqlPool.query( get_portfolio_query );

    const get_portfolio_images = "SELECT " +
      "image_data, portfolio_entry_id " +
      "FROM portfolio_images;";
    const [image_rows,image_fields] =
      await sqlPool.query( get_portfolio_images );

    res.send( JSON.stringify({
      "result": "success",
      "portfolio_data": port_rows,
      "portfolio_images": image_rows
    }));
  } catch( error_obj ) {
    await error.log(
      "main.js:app.get:get_portfolio",
      error_obj.toString()
    );
    res.send( JSON.stringify({
      "result": "failure",
      "reason": error_obj.toString()
    }));
  }
});

app.get( '/delete_entity/:entity_id', async function(req,res) {
  try {
    const delete_query = "DELETE FROM portfolio_entries " +
      "WHERE portfolio_entry_id = " +
      req.params.entity_id + ";";
    const [del_row,del_field] = await
      sqlPool.query( delete_query );
    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error ) {
    await error.log(
      "main.js:app.get:delete_entity",
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

