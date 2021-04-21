rm create_schema.sql
echo "DROP DATABASE IF EXISTS Portfolio;" >> "create_schema.sql"
echo "CREATE DATABASE Portfolio;" >> "create_schema.sql"
echo "USE Portfolio;" >> "create_schema.sql"
echo "CREATE TABLE messages( name MEDIUMTEXT, timestamp TIMESTAMP, email MEDIUMTEXT, organization MEDIUMTEXT, message_text LONGTEXT );" >> "create_schema.sql"
echo "CREATE TABLE blog_posts( title MEDIUMTEXT, timestamp TIMESTAMP, body LONGTEXT, post_id INT, PRIMARY KEY(post_id), is_root BOOLEAN, root_id INT, FOREIGN KEY (root_id) REFERENCES blog_posts(post_id), postorder SMALLINT );" >> "create_schema.sql"
echo "CREATE TABLE blog_images( image_id INT, PRIMARY KEY(image_id), image_data MEDIUMTEXT, alt_text TEXT );" >> "create_schema.sql"
echo "CREATE TABLE portfolio_images( image_id INT, PRIMARY KEY(image_id), image_data MEDIUMTEXT, alt_text TEXT );" >> "create_schema.sql"
echo "CREATE TABLE commenters( commenter_id INT, PRIMARY KEY(commenter_id), username_hash VARBINARY(64), password_hash VARBINARY(64) );" >> "create_schema.sql"
echo "CREATE TABLE commenters_images( image_id INT, PRIMARY KEY(image_id), image_data MEDIUMTEXT, alt_text TEXT );" >> "create_schema.sql"
echo "CREATE TABLE commenters_comments( comment_id INT, PRIMARY KEY(comment_id), blog_post_id INT, FOREIGN KEY (blog_post_id) REFERENCES blog_posts(post_id), timestamp TIMESTAMP, reply_to_id INT, FOREIGN KEY (reply_to_id) REFERENCES blog_posts(post_id), commenter_id INT, FOREIGN KEY (commenter_id) REFERENCES commenters(commenter_id) );" >> "create_schema.sql"
echo "CREATE TABLE error_log( error_id INT, PRIMARY KEY(error_id), timestamp TIMESTAMP, severity TINYINT, source VARCHAR(256), message TEXT );" >> "create_schema.sql"