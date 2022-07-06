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

function process_timestamp( inTimestampString ) {
  const formatted_string = inTimestampString.replace(" ","T") + ".000Z";
  const timestamp = new Date(formatted_string);
  timestamp.setHours( timestamp.getHours() - 4 );
  const timezoned_string = timestamp.toISOString().substring(0,16);
  const stamp_split = timezoned_string.split("T");
  const time_split = stamp_split[1].split(":");
  let hour = time_split[0];
  if( hour.startsWith("0") ) {
    hour = hour.substring(2,1);
  }
  let suffix = " AM";
  if( hour > 12 ) {
    hour -= 12;
    suffix = " PM";
  } else if( hour == 12 ) {
    suffix = " PM";
  }
  return stamp_split[0] + " " + hour + ":" + time_split[1] + suffix;
}