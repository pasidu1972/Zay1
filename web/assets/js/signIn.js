async function signIn() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const signIn = {
        email: email,
        password: password
    };

    const signInJson = JSON.stringify(signIn);

    const response = await fetch(
            "http://localhost:8080/Zay1/SignIn",
            {
                method: "POST",
                body: signInJson,
                headers: {
                    "Content-Type": "application/json"
                }
            }
    );

    if (response.ok) {

        const json = await response.json();
        if (json.status) {
            // Update UI state after successful sign-in
            if (typeof updateUserDropdown === 'function') {
                // If we're on a page with the dropdown, update it
                checkUserSignInStatus();
            }
            
            if (json.message === "1") {
                window.location = "verify-account.html";
            } else {
                window.location = "index.html";
            }
        } else {
            document.getElementById("message").innerHTML = json.message;
        }

    } else {
        document.getElementById("message").innerHTML = "Sign In Failed. Please Try Again";
    }
}

// // Function to check user sign-in status (for dropdown updates)
// async function checkUserSignInStatus() {
//     try {
//         const response = await fetch("http://localhost:8080/Zay1/CheckSession", {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });
        
//         if (response.ok) {
//             const data = await response.json();
//             if (typeof updateUserDropdown === 'function') {
//                 updateUserDropdown(data.isSignedIn, data.userName);
//             }
//         }
//     } catch (error) {
//         console.error('Error checking session:', error);
//         if (typeof updateUserDropdown === 'function') {
//             updateUserDropdown(false, null);
//         }
//     }
// }

// // Function to handle sign out from dropdown
// async function signOut() {
//     try {
//         const response = await fetch("http://localhost:8080/Zay1/SignOut", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });
        
//         if (response.ok) {
//             const data = await response.json();
//             if (data.status) {
//                 alert('Signed out successfully!');
//                 if (typeof updateUserDropdown === 'function') {
//                     updateUserDropdown(false, null);
//                 }
//                 // Redirect to home page
//                 window.location.href = 'index.html';
//             } else {
//                 alert('Error signing out: ' + data.message);
//             }
//         } else {
//             alert('Error signing out. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error signing out:', error);
//         alert('Error signing out. Please try again.');
//     }
// }

// // Function to update the user dropdown (to be included in pages with the dropdown)
// function updateUserDropdown(isSignedIn, userName) {
//     const signInOption = document.getElementById('signInOption');
//     const signUpOption = document.getElementById('signUpOption');
//     const profileOption = document.getElementById('profileOption');
//     const signOutOption = document.getElementById('signOutOption');
//     const signOutButton = document.getElementById('signOutButton');
//     const userNameDisplay = document.getElementById('userNameDisplay');
//     const userBadge = document.getElementById('userBadge');

//     // Check if elements exist (they might not be on all pages)
//     if (!signInOption) return;

//     if (isSignedIn) {
//         // User is signed in - show profile and sign out options
//         signInOption.classList.add('d-none');
//         signUpOption.classList.add('d-none');
//         profileOption.classList.remove('d-none');
//         signOutOption.classList.remove('d-none');
//         signOutButton.classList.remove('d-none');
        
//         if (userName && userNameDisplay) {
//             userNameDisplay.textContent = userName;
//             userNameDisplay.classList.remove('d-none');
//         }
        
//         // Update badge to show user is signed in
//         if (userBadge) {
//             userBadge.classList.add('bg-success');
//             userBadge.classList.remove('bg-light');
//             userBadge.textContent = '●';
//         }
//     } else {
//         // User is not signed in - show sign in and sign up options
//         signInOption.classList.remove('d-none');
//         signUpOption.classList.remove('d-none');
//         profileOption.classList.add('d-none');
//         signOutOption.classList.add('d-none');
//         signOutButton.classList.add('d-none');
//         if (userNameDisplay) {
//             userNameDisplay.classList.add('d-none');
//         }
        
//         // Update badge to show user is not signed in
//         if (userBadge) {
//             userBadge.classList.remove('bg-success');
//             userBadge.classList.add('bg-light');
//             userBadge.textContent = '+99';
//         }
//     }
// }

// // Check user status when page loads (only if dropdown elements exist)
// window.addEventListener('DOMContentLoaded', function() {
//     if (document.getElementById('userDropdown')) {
//         checkUserSignInStatus();
//     }
// });

// async function authenticateUser() {
//    try {
//        const response = await fetch("SignIn");

//        if (response.ok) {
            
//            const json = await response.json();
           
//            if (json.message === "1") {
//                window.location.href = "index.html";
//            }
//        } else {
//            console.error("Server returned error status:", response.status);
//        }
//    } catch (error) {
//        console.error("Error while authenticating user:", error);
//    }
// }