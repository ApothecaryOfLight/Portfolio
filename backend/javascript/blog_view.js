"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_get_blog_page( app, sqlPool ) {
    app.get( '/get_blog_page/:page', async function(req,res) {
        try {
            //Get the 5 most recent posts
            const recent_posts = "SELECT " +
            "title, timestamp, body, post_id, series_title " +
            "FROM blog_posts " +
            "ORDER BY timestamp DESC " +
            "LIMIT 5;";
            const [rec_row,rec_field] =
                await sqlPool.query( recent_posts );
    
            //Get the images for the posts.
            const recent_post_ids = [];
            let recent_post_where_predicate = "";
            for( const index in rec_row ) {
                recent_post_ids.push( rec_row[index].post_id );
                recent_post_where_predicate += rec_row[index].post_id;
                if( index < rec_row.length-1 ) {
                    recent_post_where_predicate += " OR post_id = ";
                }
            }
            const recent_post_images_query = "SELECT " +
            "image_id, image_data, post_id, alt_text, optional_link, local_image_id, post_section " +
            "FROM blog_images " +
            "WHERE post_id = " +
            recent_post_where_predicate + ";";
            const [recent_images_row,recent_images_fields] =
            await sqlPool.query( recent_post_images_query );
    
            //Combine them.
            const blog_posts_obj = {
                "posts": rec_row,
                "page": 1,
                "images": recent_images_row
            };
    
            //Return them.
            res.send( JSON.stringify({
                "result": "success",
                "blog_posts": blog_posts_obj
            }));
        } catch( error_obj ) {
            await error.log(
                "blog_view.js::attach_route_get_blog_page",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_get_blog_page = attach_route_get_blog_page;


function attach_route_page_count( app, sqlPool ) {
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
                "blog_view.js::attach_route_page_count",
                error_obj
            );
            res.send( JSON.stringify({
                "result": "failure",
                "reason": error_obj
            }));
        }
    });
}
exports.attach_route_page_count = attach_route_page_count;