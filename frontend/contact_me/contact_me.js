"use strict";


/*
Function to attach an event listener to the contact me button.
*/
function attach_contact_me_listener() {
    //Get a reference to the contact me button.
    const send_message = document.getElementById("submit_contact_me");

    //Add a click listener to the contact me button.
    send_message.addEventListener( 'click', (click) => {
        //Get the text values of the input fields in the contact me interface.
        const name = document.getElementById("name").value;
        const org = document.getElementById("org").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const msg = document.getElementById("msg").value;

        //Send a request to the server to log the new contact me message.
        const send_contact_me = new Request(
        ip + 'contact_me/',
        {
            method: 'POST',
            body: JSON.stringify({
                "name" : name,
                "org" : org,
                "phone" : phone,
                "email" : email,
                "msg" : msg
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        fetch( send_contact_me );
    });
}