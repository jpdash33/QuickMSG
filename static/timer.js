
(() => {
    const passcodeElement = document.getElementById("passcode");
    const timerBox = document.getElementById("message-timer");
    const timerDisplay = document.getElementById("timer-display");
    const timerLabel = document.getElementById("timer-label");

    let countdownInterval = null;
    let expiryTime = null;
    let lastPasscode = "";

    // The timer stays hidden until a passcode is generated.
    timerBox.classList.add("timer-idle");

    function renderCountdown() {
        const remaining = Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000));
        const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
        const seconds = String(remaining % 60).padStart(2, "0");

        timerDisplay.textContent = `${minutes}:${seconds}`;

        if (remaining <= 30 && remaining > 0) {
            timerBox.classList.add("timer-warning");
        } else {
            timerBox.classList.remove("timer-warning");
        }

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            timerLabel.textContent = "Message expired";
            timerDisplay.textContent = "00:00";
            timerBox.classList.add("timer-expired");
        }
    }

    function startCountdown(passcode) {
        const cleanedCode = passcode.trim();

        if (!cleanedCode || cleanedCode.length !== 6 || cleanedCode === lastPasscode) {
            return;
        }

        lastPasscode = cleanedCode;
        if (countdownInterval) clearInterval(countdownInterval);

        expiryTime = Date.now() + 120000;
        timerLabel.textContent = "Message expires in";
        timerBox.classList.remove("timer-idle", "timer-expired", "timer-warning");
        renderCountdown();
        countdownInterval = setInterval(renderCountdown, 250);
    }

    const observer = new MutationObserver(() => {
        startCountdown(passcodeElement.textContent || "");
    });

    observer.observe(passcodeElement, {
        childList: true,
        characterData: true,
        subtree: true
    });

    // Also handle a passcode already present when the page loads.
    startCountdown(passcodeElement.textContent || "");
})();
