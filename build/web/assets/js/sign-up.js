

async function signUp() {
    try {
        // Get form values
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = "Please fill in all fields.";
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = "Please enter a valid email address.";
            return;
        }

        // Create user object
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        const userJson = JSON.stringify(user);
        
        // Show loading message
        document.getElementById("message").className = "text-info";
        document.getElementById("message").innerHTML = "Creating account...";

        console.log("Attempting to connect to server...");
        console.log("URL: http://localhost:8080/Zay1/SignUp");
        console.log("Data:", userJson);

        const response = await fetch(
            "http://localhost:8080/Zay1/api/SignUp",
            {
                method: "POST",
                body: userJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
            // Success (status code 200)
            const json = await response.json();
            console.log("Server response:", json);
            
            if (json.status) {
                document.getElementById("message").className = "text-success";
                document.getElementById("message").innerHTML = json.message;
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location = "sign-in.html";
                }, 1500);
            } else {
                document.getElementById("message").className = "text-danger";
                document.getElementById("message").innerHTML = json.message;
            }
        } else {
            // HTTP error status
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = `Server error: ${response.status} - ${response.statusText}`;
        }

    } catch (error) {
        console.error("Fetch error:", error);
        
        // More specific error messages
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = "Unable to connect to server. Please check if the server is running on port 8080.";
        } else {
            document.getElementById("message").className = "text-danger";
            document.getElementById("message").innerHTML = "Registration failed. Please try again.";
        }
    }
}

// Test server connection function (optional - for debugging)
async function testServerConnection() {
    try {
        const response = await fetch("http://localhost:8080/Zay1/", { method: "GET" });
        console.log("Server connection test:", response.ok ? "SUCCESS" : "FAILED");
        console.log("Status:", response.status);
    } catch (error) {
        console.log("Server connection test: FAILED");
        console.error("Error:", error);
    }
}

// Call this in browser console to test: testServerConnection()