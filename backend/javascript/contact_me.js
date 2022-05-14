"use strict";

/*File system*/
const file_stream = require('fs');

/*Error Logging*/
const error = require('../error_logging.js');

function attach_route_contact_me( app ) {
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
            "contact_me.js::attach_route_contact_me",
            error_obj
          );
        }
      });
}
exports.attach_route_contact_me = attach_route_contact_me;