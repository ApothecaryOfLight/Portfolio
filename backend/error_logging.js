const mysql = require('mysql2');

const sqlPool = mysql.createPoolPromise({
  host: 'localhost',
  user: 'Portfolio_User',
  password: 'Portfolio_Password',
  database: 'Portfolio',
  connectionLimit: 50,
  multipleStatements: true
});

async function log( source, message ) {
  const timestamp = new Date();
  let timestamp_string = timestamp.toISOString();
  timestamp_string = timestamp_string.replace( /T/, " " );
  timestamp_string = timestamp_string.slice(
    0,
    timestamp_string.length - 5
  );

  const new_error_id_query =
    "SELECT Portfolio.generate_new_id( 0 ) as new_id;";
  const [new_error_row,new_error_field] =
    await sqlPool.query( new_error_id_query );
  const new_error_id = new_error_row[0].new_id;

  const add_error_query =
    "INSERT INTO error_log " +
    "(error_id, source, message, timestamp) VALUES " +
    "(" + new_error_id + 
    ", \'" + source +
    "\', \'" + message +
    "\', " +
    "\'" + timestamp_string + "\'" +
    ");"
  const [add_rows,add_fields] = await sqlPool.query( add_error_query );
  return add_rows;
}

async function get_log( page, page_size ) {
  const error_log_query =
    "SELECT timestamp, severity, source, message " +
    "FROM error_log;";
  const [log_rows,log_fields] = await sqlPool.query( error_log_query );
  return log_rows;
}

function get_log_by_search( search, page, page_size ) {

}

exports.log = log;
exports.get_log = get_log;
