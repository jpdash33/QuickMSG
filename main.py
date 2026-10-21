from flask import Flask,request,render_template
from datetime import datetime
import string
import secrets
import json
import threading

app = Flask(__name__)

4
def clear_packet(passcode):
    try:
        with open("packet.json", "r", encoding="utf-8") as f:
            packet = json.load(f)

        # Don't delete a newer message
        if packet.get("code") == passcode:
            with open("packet.json", "w", encoding="utf-8") as f:
                json.dump({}, f)

            print(f"Message expired: {passcode}")

    except (FileNotFoundError, json.JSONDecodeError):
        pass



@app.route("/")
def main():
    return render_template("index.html")


@app.route("/code",methods=["POST"])
def code():

    user_data = request.get_json(silent=True) or {}
    message = user_data.get("msg", "").strip()

    if not message:
        return {"status": 400, "error": "Message cannot be empty"}, 400


    characters = string.ascii_uppercase + string.digits
    passcode = "".join( secrets.choice(characters) for _ in range(6) )

    with open("DB.txt", "a", encoding="utf-8") as f:
        f.write(
            f"Passcode: {passcode}\n"
            f"Message: {message}\n"
            f"Date: {datetime.now().strftime("%d/%m/%Y, %H:%M:%S")}\n"
            f"{'-' * 40}\n"
        )

    d = {
        "msg":message,
        "code":passcode
    }

    with open("packet.json","w") as f:
        json.dump(d,f,indent=4)

    timer = threading.Timer( 120, clear_packet, args=[passcode] )
    timer.daemon = True
    timer.start()


    return {"status":200,
            "passscode":passcode}



@app.route("/msg", methods=["POST"])
def msg():
    data = request.get_json(silent=True) or {}
    r_code = data.get("code", "").strip().upper()

    if not r_code:
        return {
            "status": 400,
            "error": "Please enter a passcode."
        }, 400

    try:
        with open("packet.json", "r", encoding="utf-8") as f:
            packet = json.load(f)

    except FileNotFoundError:
        return {
            "status": 404,
            "error": "No message has been generated yet."
        }, 404


    if packet.get("code") == r_code:
        return {
            "status": 200,
            "msg": packet.get("msg", "")
        }, 200

    return {
        "status": 404,
        "error": "Invalid passcode or message not found."
    }, 404

    

app.run(debug=True)