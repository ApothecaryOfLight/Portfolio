"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_new_blog_post( app, sqlPool ) {
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
                " ( " +
                req.body.images[index].image_id + ", " +
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
                "blog_edit.js::attach_route_new_blog_post",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_new_blog_post = attach_route_new_blog_post;


function attach_route_delete_post( app, sqlPool ) {
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
            "blog_edit.js::attach_route_delete_post",
            error_obj
            );
            res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
            }));
        }
    });
}
exports.attach_route_delete_post = attach_route_delete_post;


function attach_route_edit_blog_post( app, sqlPool ) {
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
                "root_id = " + root_id + ", " +
                "postorder = 0 " + " " +
                "WHERE post_id = " + req.body.post_id + ";"
            const [update_row,update_field] =
                await sqlPool.query( update_query );
        
            //1) Get list of images attached in DB to post.
            const get_image_ids = "SELECT image_id " +
                "FROM blog_images " +
                "WHERE post_id = " + req.body.post_id + ";";
            const [image_rows,image_fields] =
                await sqlPool.query( get_image_ids );
            const existing_image_ids = [];
            for( index in image_rows ) {
                existing_image_ids.push( image_rows[index].image_id );
            }
        
            const req_image_ids = [];
            //2) Get image ids to delete and image data to insert.
            const image_data = [];
            const del_image_ids = [];
            for( let image_index in req.body.images ) {
                if( req.body.images[image_index].image_id == null ) {
                image_data.push(
                    req.body.images[image_index]
                );
                } else {
                const img_id = req.body.images[image_index].image_id;
                req_image_ids.push( img_id );
                }
            }
        
            for( let server_index in existing_image_ids ) {
                const server_img_id = existing_image_ids[server_index];
                if( !req_image_ids.includes( server_img_id ) ) {
                del_image_ids.push( server_img_id );
                }
            }
        
            //3) Insert new images.
            if( image_data.length > 0 ) {
                let values = "";
                for( insert_index in image_data ) {
                values += "(" +
                    "(SELECT Portfolio.generate_new_id(2)), " +
                    image_data.local_image_id + ", " +
                    req.body.post_id + ", " +
                    "\'" + image_data.image_data + "\')";
                if( insert_index < image_data.length-1 ) {
                    values += ", ";
                }
                }
                const insert_query = "INSERT INTO blog_images " +
                "(image_id, local_image_id, post_id, image_data) " +
                "VALUES " + values + ";"
                const [insert_row,insert_field] =
                await sqlPool.query( insert_query );
            }
        
            //4) Delete removed images.
            if( del_image_ids.length > 0 ) {
                let del_predicate = "";
                for( let del_index in del_image_ids ) {
                del_predicate += "image_id = " +
                    del_image_ids[del_index];
                if( del_index < del_image_ids.length-1 ) {
                    del_predicate += " OR "
                }
                }
                const delete_query = "DELETE FROM blog_images " +
                "WHERE " + del_predicate + ";";
                const [del_rows,del_fields] =
                await sqlPool.query( delete_query );
            }
        
        
            res.send( JSON.stringify({
                "result": "success"
            }));
        } catch( error_obj ) {
            await error.log(
                "blog_edit.js::attach_route_edit_blog_post",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
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


function attach_route_get_root_posts( app, sqlPool ) {
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
                "blog_edit.js::attach_route_get_root_posts",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_root_posts = attach_route_get_root_posts;


function attach_get_existing_posts( app, sqlPool ) {
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