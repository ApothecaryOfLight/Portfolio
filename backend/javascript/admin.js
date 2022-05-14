"use strict";

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_get_errors( app ) {
    app.get( '/get_errors', async function(req,res) {
        try {
            const errors = await error.get_log();
            res.send({
                error_log: errors
            });
        } catch(error_obj) {
            await error.log(
                "admin.js::attach_route_get_errors",
                error_obj
            );
        }
    });
}
exports.attach_route_get_errors = attach_route_get_errors;