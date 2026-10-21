async function generate_code() {

    const message = document.getElementById("sender-message").value.trim();

    if(!message){
        alert("Please enter your message first.....");
        document.getElementById("sender-message").focus();
        return;
    }


    const response = await fetch("/code", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({
            msg:message
        })
    });

    const data = await response.json();

    if(data["status"] === 200)
    {
        document.getElementById("passcode").textContent = data["passscode"]
    }
    else{
        alert("Server issue....")
    }


}
