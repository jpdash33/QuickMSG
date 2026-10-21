async function receive_msg() {
    const code = document
        .getElementById("receiver-code")
        .value.trim();

    if (!code) {
        alert("Please enter the passcode first...");
        document.getElementById("receiver-code").focus();
        return;
    }

    try {
        const response = await fetch("/msg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        });

        const data = await response.json();

        if (response.ok && data.status === 200) {
            document.getElementById("received-message").value = data.msg;
        } else {
            alert(data.error || "Message not found.");
        }
    } catch (error) {
        console.error(error);
        alert("Unable to connect to the server.");
    }
}
