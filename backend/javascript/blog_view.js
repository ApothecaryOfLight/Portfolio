"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_get_blog_page( app, sqlPool ) {
    app.get( '/get_blog_page/:page', async function(req,res) {
        try {
        if( req.params.page == 1 ) {
            //1) Get the 5 most recent posts
            const recent_posts = "SELECT " +
            "title, timestamp, body, post_id " +
            "FROM blog_posts " +
            "ORDER BY timestamp DESC " +
            "LIMIT 5;";
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
            for( const index in rec_row ) {
                recent_post_ids.push( rec_row[index].post_id );
                recent_post_where_predicate += rec_row[index].post_id;
                if( index < rec_row.length-1 ) {
                    recent_post_where_predicate += " OR post_id = ";
                }
            }
            const recent_post_images_query = "SELECT " +
            "image_id, image_data, post_id, local_image_id " +
            "FROM blog_images " +
            "WHERE post_id = " +
            recent_post_where_predicate + ";";
            const [recent_images_row,recent_images_fields] =
            await sqlPool.query( recent_post_images_query );
    
            let roots_images_row_out = null;
            if( roots_row.length > 0 ) {
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
                "image_id, image_data, post_id, local_image_id " +
                "FROM blog_images " +
                "WHERE post_id = " +
                recent_roots_where_predicate + ";";
            const [roots_images_row,roots_images_fields] =
                await sqlPool.query( recent_roots_images_query );
            roots_images_row_out = roots_images_row;
            }
    
            //4) Combine them.
            const blog_posts_obj = {
            "recent_posts": rec_row,
            "root_posts": roots_row,
            "page": 1,
            "recent_posts_images": recent_images_row,
            "root_posts_images": roots_images_row_out
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