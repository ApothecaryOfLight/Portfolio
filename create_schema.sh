rm create_schema.sql
echo "DROP DATABASE IF EXISTS Portfolio;" >> "create_schema.sql"
echo "CREATE DATABASE Portfolio;" >> "create_schema.sql"
echo "USE Portfolio;" >> "create_schema.sql"
echo "CREATE TABLE messages( name MEDIUMTEXT, timestamp TIMESTAMP, email MEDIUMTEXT, organization MEDIUMTEXT, message_text LONGTEXT );" >> "create_schema.sql"
echo "CREATE TABLE blog_posts( title MEDIUMTEXT, timestamp TIMESTAMP, body LONGTEXT, post_id INT, PRIMARY KEY(post_id), is_root BOOLEAN, root_id INT, FOREIGN KEY (root_id) REFERENCES blog_posts(post_id), postorder SMALLINT );" >> "create_schema.sql"
echo "CREATE TABLE blog_images( image_id INT, PRIMARY KEY(image_id), image_data MEDIUMTEXT, alt_text TEXT, optional_link TEXT, post_id INT, FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE, local_image_id SMALLINT, FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE );" >> "create_schema.sql"
echo "CREATE TABLE portfolio_entries( portfolio_entry_id INT, PRIMARY KEY(portfolio_entry_id), portfolio_title TEXT, portfolio_text MEDIUMTEXT, portfolio_flags MEDIUMTEXT, github_link TEXT, live_page TEXT );" >> "create_schema.sql"
echo "CREATE TABLE portfolio_images( image_name VARCHAR(255), image_id INT, PRIMARY KEY(image_id), local_image_id INT, image_data MEDIUMTEXT, alt_text TEXT, portfolio_entry_id INT, FOREIGN KEY (portfolio_entry_id) REFERENCES portfolio_entries(portfolio_entry_id) ON DELETE CASCADE );" >> "create_schema.sql"
echo "CREATE TABLE commenters( commenter_id INT, PRIMARY KEY(commenter_id), username_hash VARBINARY(64), password_hash VARBINARY(64) );" >> "create_schema.sql"
echo "CREATE TABLE commenters_images( image_id INT, PRIMARY KEY(image_id), image_data MEDIUMTEXT, alt_text TEXT );" >> "create_schema.sql"
echo "CREATE TABLE commenters_comments( comment_id INT, PRIMARY KEY(comment_id), blog_post_id INT, FOREIGN KEY (blog_post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE, timestamp TIMESTAMP, reply_to_id INT, FOREIGN KEY (reply_to_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE, commenter_id INT, FOREIGN KEY (commenter_id) REFERENCES commenters(commenter_id) ON DELETE CASCADE );" >> "create_schema.sql"
echo "CREATE TABLE error_log( error_id INT, PRIMARY KEY(error_id), timestamp TIMESTAMP, severity TINYINT, source VARCHAR(256), message TEXT );" >> "create_schema.sql"

echo "CREATE USER IF NOT EXISTS 'Portfolio_User'@'localhost' IDENTIFIED BY 'Portfolio_Password';" >> "create_schema.sql"
echo "GRANT ALL ON Portfolio.* TO 'Portfolio_User'@'localhost';" >> "create_schema.sql"

#ID Manager
echo "CREATE TABLE sequence_last( sequence_id TINYINT, last BIGINT NOT NULL );" >> "create_schema.sql"
echo "CREATE TABLE sequence_retired( sequence_id TINYINT, retired_id BIGINT NOT NULL );" >> "create_schema.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (0,0);" >> "create_schema.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (1,0);" >> "create_schema.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (2,0);" >> "create_schema.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (3,0);" >> "create_schema.sql"
echo "INSERT INTO sequence_last (sequence_id,last) VALUES (4,0);" >> "create_schema.sql"

echo "DELIMITER %%" >> "create_schema.sql"
echo "CREATE FUNCTION Portfolio.generate_new_id( in_sequence_id TINYINT )" >> "create_schema.sql"
echo "RETURNS BIGINT" >> "create_schema.sql"
echo "NOT DETERMINISTIC" >> "create_schema.sql"
echo "CONTAINS SQL" >> "create_schema.sql"
echo "READS SQL DATA" >> "create_schema.sql"
echo "BEGIN" >> "create_schema.sql"
echo "DECLARE RetiredID BIGINT;" >> "create_schema.sql"
echo "DECLARE LastID BIGINT;" >> "create_schema.sql"
echo "SET @RetiredID = (SELECT retired_id FROM sequence_retired WHERE sequence_id = in_sequence_id LIMIT 1);" >> "create_schema.sql"
echo "SET @LastID = (SELECT last FROM sequence_last WHERE sequence_id = in_sequence_id LIMIT 1);" >> "create_schema.sql"
echo "IF @RetiredID IS NULL THEN UPDATE sequence_last SET last = last + 1 WHERE sequence_id = in_sequence_id;" >> "create_schema.sql"
echo "ELSE DELETE FROM sequence_retired WHERE retired_id = @RetiredID AND sequence_id = in_sequence_id;" >> "create_schema.sql"
echo "END IF;" >> "create_schema.sql"
echo "SET @NewID = COALESCE( @RetiredID, @LastID );" >> "create_schema.sql"
echo "RETURN @NewID;" >> "create_schema.sql"
echo "END" >> "create_schema.sql"
echo "%%" >> "create_schema.sql"
echo "DELIMITER ;" >> "create_schema.sql"
