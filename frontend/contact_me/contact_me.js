function attach_contact_me_listener() {
    const send_message = document.getElementById("submit_contact_me");
    send_message.addEventListener( 'click', (click) => {
        const name = document.getElementById("name").value;
        const org = document.getElementById("org").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const msg = document.getElementById("msg").value;
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