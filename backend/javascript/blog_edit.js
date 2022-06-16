"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function deregex( inText ) {
    let processed_text = inText.replace(
      /&#39;/g,
      "\'"
    );
    processed_text = processed_text.replace(
      /&#34;/g,
      "\""
    );
    processed_text = processed_text.replace(
      /&#92;/g,
      "\\"
    );
    processed_text = processed_text.replace(
      /&#47;/g,
      "\/"
    );
    processed_text = processed_text.replace(
      /<br>/g,
      "\n"
    );
    return processed_text;
}

function reregex( inText ) {
    let processed_text = inText.replace(
      /\'/g,
      "&#39;"
    );
    processed_text = processed_text.replace(
      /\"/g,
      "&#34;"
    );
    processed_text = processed_text.replace(
      /\\/g,
      "&#92;"
    );
    processed_text = processed_text.replace(
      /\//g,
      "&#47;"
    );
    processed_text = processed_text.replace(
      /[\r\n\b]/g,
      "<br>"
    );
    return processed_text;
}

function replace_image_id_nulls( body_text, image_id_map ) {
    const cleaned_input = deregex( body_text );
    const body_obj = JSON.parse( cleaned_input );
    for( const key in body_obj ) {
        const ref = body_obj[key];
        ref.image_id = image_id_map[ref.local_image_id];
    }
    const body_string = JSON.stringify( body_obj );
    const body_reregexed = reregex( body_string );
    return body_reregexed;
}

async function add_blog_post( req, res, sqlPool, inTimestamp ) {
    try {
        let new_blog_post_image_query = "";

        //Get a new unique identifier
        const new_post_id_query = "SELECT " +
            "Portfolio.generate_new_id( 1 ) as new_id;";
        const [new_id_row,new_id_field] =
            await sqlPool.query( new_post_id_query );
        const new_blog_post_id = new_id_row[0].new_id;

        const image_id_map = [];
        //Create the insertion query for the blog images.
        for( const index in req.body.images ) {
            //Get a new unique identifier for each image.
            const new_image_id_query = "SELECT " +
                "Portfolio.generate_new_id( 2 ) as new_image_id;";
            const [new_id_row,new_id_field] =
                await sqlPool.query( new_image_id_query );
            const new_image_id = new_id_row[0].new_image_id;

            image_id_map[ req.body.images[index].local_image_id ] = new_image_id;

            new_blog_post_image_query += "INSERT INTO blog_images " +
                "( image_id, local_image_id, post_section, post_id, image_data ) " +
                "VALUES " +
                " ( " +
                new_image_id + ", " +
                req.body.images[index].local_image_id + ", " +
                req.body.images[index].post_section + ", " +
                new_blog_post_id + ", " +
                "\'" + req.body.images[index].image_data + "\' ); ";
        }

        //Set the new image IDs in the body of the new post.
        const body_text = replace_image_id_nulls( req.body.body, image_id_map );

        //Get the timestamp
        let timestamp;
        if( inTimestamp != null ) {
            timestamp = inTimestamp;
        } else {
            timestamp = error.get_timestamp();
        }
    
        let new_blog_post_query = "";
        if( req.body.series_id == -2 ) { //No series
            new_blog_post_query += "INSERT INTO blog_posts " +
                "(title, body, timestamp, post_id, series_id) " +
                "VALUES ( " +
                "\'" + req.body.post_title + "\', " +
                "\'" + body_text + "\', " +
                "\'" + timestamp + "\', " +
                new_blog_post_id + ", " +
                req.body.series_id + " ); ";
        } else if( req.body.series_id == -1 ) { //New series
            const new_series_id_query = "SELECT " +
                "Portfolio.generate_new_id( 3 ) as new_id;";
            const [new_id_row,new_id_field] =
                await sqlPool.query( new_series_id_query );
            const new_series_id = new_id_row[0].new_id;

            new_blog_post_query += "INSERT INTO blog_posts " +
                "(title, body, timestamp, post_id, series_id, series_title) " +
                "VALUES ( " +
                "\'" + req.body.post_title + "\', " +
                "\'" + body_text + "\', " +
                "\'" + timestamp + "\', " +
                new_blog_post_id + ", "  +
                new_series_id + ", " +
                "\'" + req.body.series_title + "\' " +
                " ); ";
        } else if( req.body.series_id >= 0 ) {
            new_blog_post_query += "INSERT INTO blog_posts " +
                "(title, body, timestamp, post_id, series_id, series_title) " +
                "VALUES ( " +
                "\'" + req.body.post_title + "\', " +
                "\'" + body_text + "\', " +
                "\'" + timestamp + "\', " +
                new_blog_post_id + ", "  +
                req.body.series_id + ", " +
                "\'" + req.body.series_title + "\' " +
                " ); ";
        }

    
        //Query the SQL server.
        const [new_blog_post_row,new_blog_post_field] =
            await sqlPool.query( new_blog_post_query + new_blog_post_image_query );
        res.send( JSON.stringify({
            "result": "success"
        }));
    } catch( error_obj ) {
        await error.log(
            "blog_edit.js::add_blog_post",
            error_obj
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
        }));
    }
}

function attach_route_new_blog_post( app, sqlPool ) {
    app.post( '/new_blog_post', async function(req,res) {
        add_blog_post( req, res, sqlPool );
    });
}
exports.attach_route_new_blog_post = attach_route_new_blog_post;

async function delete_blog_post( post_id, res, sqlPool ) {
    try {
        const delete_query = "DELETE FROM blog_posts " +
        "WHERE post_id = " + post_id + ";";
        const [del_row,del_field] =
            await sqlPool.query( delete_query );
        res.send( JSON.stringify({
            "result": "success"
        }));
        return;
    } catch( error_obj ) {
        await error.log(
            "blog_edit.js::attach_route_delete_post",
            error_obj
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
        }));
        return;
    }
}

function attach_route_delete_post( app, sqlPool ) {
    app.get( '/delete_post/:post_id', async function(req,res) {
        delete_blog_post( req.params.post_id, res, sqlPool );
    });
}
exports.attach_route_delete_post = attach_route_delete_post;


function attach_route_edit_blog_post( app, sqlPool ) {
    app.post( '/edit_blog_post', async function(req,res) {
        const get_timestamp_query =
            "SELECT timestamp " +
            "FROM blog_posts " +
            "WHERE post_id = " + req.body.post_id + ";";
        const [timestamp_row,timestamp_field] =
            await sqlPool.query( get_timestamp_query );


        
        await delete_blog_post( req.body.post_id, res, sqlPool );
        add_blog_post( req, res, sqlPool, timestamp_row[0].timestamp );
    });
}
exports.attach_route_edit_blog_post = attach_route_edit_blog_post;



function attach_route_get_blog_images_post_id( app, sqlPool ) {
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
                "blog_edit.js::attach_route_get_blog_images_post_id",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_blog_images_post_id = attach_route_get_blog_images_post_id;


function attach_route_get_series_list( app, sqlPool ) {
    app.get( '/get_series_list', async function(req,res) {
        try {
            const query_series = "SELECT DISTINCT series_title, series_id " +
                "FROM blog_posts;"
            const [series_row,series_field] =
                await sqlPool.query( query_series );
            res.send( JSON.stringify({
                "result": "success",
                "series_list": series_row
            }));
        } catch( error_obj ) {
            await error.log(
                "blog_edit.js::attach_route_get_series_list",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_series_list = attach_route_get_series_list;


function attach_get_existing_posts( app, sqlPool ) {
    app.get( '/get_existing_posts/:series_id', async function(req,res) {
        try {
            const query_existing = "SELECT blog_posts.title, blog_posts.post_id, blog_posts.series_id " +
                "FROM blog_posts " +
                "WHERE series_id = " + req.params.series_id + ";";
            const [existing_row,existing_field] =
                await sqlPool.query( query_existing );
            res.send( JSON.stringify({
                "result": "success",
                "existing": existing_row
            }));
        } catch( error_obj ) {
            await error.log(
                "blog_edit.js::attach_get_existing_posts",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_get_existing_posts = attach_get_existing_posts;


function attach_route_get_blog_post_post_id( app, sqlPool ) {
    app.get( '/get_blog_post/:post_id', async function(req,res) {
        try {
            const get_post = "SELECT " +
                "title, body, timestamp, post_id " +
                "FROM blog_posts " +
                "WHERE post_id = " + req.params.post_id + ";";
            const [post_row,post_field] = await sqlPool.query( get_post );


            const get_images = "SELECT " +
                "image_id, local_image_id, post_section, image_data, alt_text, optional_link " +
                "FROM blog_images " +
                "WHERE post_id = " + req.params.post_id + ";";
            const [images_row,images_field] = await sqlPool.query( get_images );

            res.send( JSON.stringify({
                "result": "success",
                "post_data": post_row[0],
                "images": images_row
            }));
        } catch( error_obj ) {
            await error.log(
                "blog_edit.js::attach_route_get_blog_post_post_id",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_blog_post_post_id = attach_route_get_blog_post_post_id;


function attach_route_get_blog_posts_by_series_id( app, sqlPool ) {
    app.get( '/get_blog_posts_by_series_id/:series_id', async function(req,res) {
        try {
            const get_blog_posts = "SELECT blog_posts.title, blog_posts.post_id " +
                "FROM blog_posts " +
                "WHERE series_id = " + req.params.series_id + ";";
            const [existing_row,existing_field] =
                await sqlPool.query( get_blog_posts );
            res.send( JSON.stringify({
                "result": "success",
                "existing": existing_row
            }));

        } catch( error_obj ) {
            await error.log(
                "blog_edit.js::attach_route_get_blog_posts_by_series_id",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_blog_posts_by_series_id = attach_route_get_blog_posts_by_series_id;