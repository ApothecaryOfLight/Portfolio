"use strict";


/*
Function to run regex on blog text from the server to make it Human readable.

inBody: Text to process.
*/
function process_blog_text_body( inBody ) {
    let newText = "<p>";
    newText += inBody.replace( /<br><br>|<br>/g, "</p><p>" );
    newText += "</p>";
    return newText;
}