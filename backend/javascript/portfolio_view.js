"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

//TODO: Cache this response on startup until it is updated.
let isCached = false;
let cached = "";

function attach_route_get_portfolio( app, sqlPool ) {
    app.get( '/get_portfolio', async function(req,res) {
    try {
        if( isCached == true ) {
        res.send( cached );
        return;
        }
        const get_portfolio_query = "SELECT " +
        "portfolio_entry_id, portfolio_title, " +
        "portfolio_text, portfolio_flags, github_link, " +
        "live_page, dev_page " +
        "FROM portfolio_entries;";
        const [port_rows,port_fields ] =
        await sqlPool.query( get_portfolio_query );

        const get_portfolio_images = "SELECT " +
        "image_data, portfolio_entry_id " +
        "FROM portfolio_images " +
        ";";
        const [image_rows,image_fields] =
        await sqlPool.query( get_portfolio_images );

        const response = JSON.stringify({
        "result": "success",
        "isDev": (process.argv[2] == "http"),
        "portfolio_data": port_rows,
        "portfolio_images": image_rows
        });

        cached = response;
        isCached = true;

        res.send( response );
    } catch( error_obj ) {
        await error.log(
        "portfolio_view.js::attach_route_get_portfolio",
        error_obj
        );
        res.send( JSON.stringify({
        "result": "failure",
        "reason": error_obj
        }));
    }
    });
}
exports.attach_route_get_portfolio = attach_route_get_portfolio;