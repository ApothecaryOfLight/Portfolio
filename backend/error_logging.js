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
  const add_error_query =
    "INSERT INTO error_log " +
    "(source, message) VALUES " +
    "(\'" + source "\', \'" + message + "\');"
  const [add_rows,add_fields] = await sqlPool.query( add_error_query );
  return add_rows;
}

async function get_log( page, page_size ) {
  const error_log_query =
    "SELECT timestamp, severity, source, message " +
    "FROM error_log ";
  const [log_rows,log_fields] = await sqlPool.query( error_log_query );
  return log_rows;
}

function get_log_by_search( search, page, page_size ) {

}
