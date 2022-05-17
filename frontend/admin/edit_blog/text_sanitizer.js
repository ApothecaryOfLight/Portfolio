"use strict";


/*
Function to apply regex to outgoing text, replacing SQL sensitive characters with
HTML character codes.
*/
function process_outgoing_text( inText ) {
  let processed_text = inText.replace(
    /\'/g,
    "&#39;"
  );
  processed_text = processed_text.replace(
    /\"/g,
    "&#34;"
  );
  processed_text = processed_text.replace(
    /\\/g,
    "&#92;"
  );
  processed_text = processed_text.replace(
    /\//g,
    "&#47;"
  );
  processed_text = processed_text.replace(
    /[\r\n\b]/g,
    "<br>"
  );
  return processed_text;
}


/*
Function to apply regex to incoming text, replacing SQL HTML character codes with
sensitive characters.
*/
function process_incoming_text( inText ) {
  let processed_text = inText.replace(
    /&#39;/g,
    "\'"
  );
  processed_text = processed_text.replace(
    /&#34;/g,
    "\""
  );
  processed_text = processed_text.replace(
    /&#92;/g,
    "\\"
  );
  processed_text = processed_text.replace(
    /&#47;/g,
    "\/"
  );
  processed_text = processed_text.replace(
    /<br>/g,
    "\n"
  );
  return processed_text;
}