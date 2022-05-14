"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_get_portfolio_entries( app, sqlPool ) {
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
            "portfolio_edit.js::attach_route_get_portfolio_entries",
            error_obj
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
        }));
        }
    });
}
exports.attach_route_get_portfolio_entries = attach_route_get_portfolio_entries;


function attach_route_add_portfolio_entry( app, sqlPool ) {
    //TODO: Put all of these queries into a single transaction
    app.post( '/add_portfolio_entry', async function(req,res) {
        try {
        isCached = false;
    
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
    
    //TODO: Split image code between new project and update project.
    
        //1) Query existing image_ids.
        const get_image_ids_query = "SELECT image_id " +
            "FROM portfolio_images " +
            "WHERE portfolio_entry_id = " +
            req.body.portfolio_entry_id + ";";
        const [image_id_rows,image_id_fields] =
            await sqlPool.query( get_image_ids_query );
        const exist_image_ids = [];
        const server_image_ids = [];
        for( server_index in image_id_rows ) {
            server_image_ids.push( image_id_rows[server_index].image_id );
        }
    
        //2) Get the image_ids submitted in the request.
        const req_image_ids = [];
        const req_image_data = [];
        for( req_index in req.body.images ) {
            if( req.body.images[req_index].image_id == null ) {
            req_image_data.push(
                req.body.images[req_index].image_data
            );
            } else {
            req_image_ids.push(
                req.body.images[req_index].image_id
            );
            }
        }
    
        //3) Determine which, if any, images to delete.
        const images_to_delete = [];
        for( index_server in server_image_ids ) {
            const ref = server_image_ids[index_server];
            if( !req_image_ids.includes( ref ) ) {
            images_to_delete.push( ref );
            }
        }
    
        if( images_to_delete.length > 0 ) {
            let delete_images_predicate = "WHERE ";
            for( del_index in images_to_delete ) {
            delete_images_predicate += "image_id = " +
                images_to_delete[del_index];
            if( del_index < images_to_delete.length-1 ) {
                delete_images_predicate += " OR ";
            }
            }
            const delete_query = "DELETE FROM " +
            "portfolio_images " + delete_images_predicate + ";";
            const [del_rows,del_fields] =
            await sqlPool.query( delete_query );
        }
    
        //4) Insert the new images.
        if( req_image_data.length > 0 ) {
            let insert_image_values = "VALUES ";
            for( index in req_image_data ) {
            insert_image_values += "( " +
                "(SELECT Portfolio.generate_new_id(4)), " +
                new_entity_id + ", " +
                "\'" +
                req_image_data[index] +
                "\' " +
                ")";
            if( index < req_image_data.length-1 ) {
                insert_image_values += ", ";
            }
            }
            const insert_images_query = "INSERT INTO " +
            "portfolio_images " +
            "(image_id, " +
            "portfolio_entry_id, image_data ) " +
            insert_image_values + ";";
            const [insert_row,insert_field] =
            await sqlPool.query( insert_images_query );
        }
    
    
        res.send( JSON.stringify({
            "result": "success"
        }));
        } catch( error_obj ) {
        const error_message = error_obj;
        await error.log(
            "portfolio_edit.js::attach_route_add_portfolio_entry",
            error_message
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_message
        }));
        }
    });
}
exports.attach_route_add_portfolio_entry = attach_route_add_portfolio_entry;



function attach_route_get_portfolio_entry( app, sqlPool ) {
    app.get( '/get_portfolio_entry/:portfolio_entity_id', async function(req,res) {
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
            "image_data, image_id " +
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
            "portfolio_eidt.js::attach_route_get_portfolio_entry",
            error_obj
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
        }));
        }
    });
}
exports.attach_route_get_portfolio_entry = attach_route_get_portfolio_entry;


function delete_entity( app, sqlPool ) {
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
        } catch( error_obj  ) {
        await error.log(
            "portfolio_eidt.js::delete_entity",
            error_obj
        );
        res.send( JSON.stringify({
            "result": "failure",
            "reason": error_obj
        }));
        }
    });
}
exports.delete_entity = delete_entity;