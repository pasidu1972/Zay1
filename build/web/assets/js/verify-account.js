

async function verifyAccount() {
    const verificationcode = document.getElementById("verificationCode").value;

    const verification = {

        verificationcode: verificationcode

    };

    const verificationJson = JSON.stringify(verification);

    const response = await fetch(
            "VerifyAccount",
            {
                method: "POST",
                body: verificationJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }



    );

    if (response.ok) {

        const json = await response.json();
        if (json.status) {

            window.location = "index.html";

        } else {

            if (json.message === "Email Not Found") {
                window.location = "sign-in.html";
            } else {

                document.getElementById("message").innerHTML = json.message;
            }
        }

    } else {
        document.getElementById("message").innerHTML = "Verification Failed. Please Try Again";

    }


}