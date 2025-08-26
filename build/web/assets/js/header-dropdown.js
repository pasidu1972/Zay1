
// // Function to check user sign-in status (for dropdown updates)
// async function checkUserSignInStatus() {
//     try {
//         console.log('Checking user sign-in status...'); // Debug log
//         const response = await fetch("http://localhost:8080/Zay1/CheckSession", {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Session check response:', data); // Debug log
//             updateUserDropdown(data.isSignedIn, data.userName);
//         } else {
//             console.error('Session check failed:', response.status);
//             updateUserDropdown(false, null);
//         }
//     } catch (error) {
//         console.error('Error checking session:', error);
//         updateUserDropdown(false, null);
//     }
// }

// // Function to handle sign out from dropdown
// async function signOut() {
//     if (!confirm('Are you sure you want to sign out?')) {
//         return;
//     }

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
//                 updateUserDropdown(false, null);
//                 // Redirect to home page
//                 window.location.href = 'index.html';
//             } else {
//                 alert('Error signing out: ' + (data.message || 'Unknown error'));
//             }
//         } else {
//             alert('Error signing out. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error signing out:', error);
//         alert('Error signing out. Please try again.');
//     }
// }

// // Function to update the user dropdown
// function updateUserDropdown(isSignedIn, userName) {
//     console.log('Updating dropdown - Signed in:', isSignedIn, 'User:', userName); // Debug log

//     const signInOption = document.getElementById('signInOption');
//     const signUpOption = document.getElementById('signUpOption');
//     const profileOption = document.getElementById('profileOption');
//     const signOutOption = document.getElementById('signOutOption');
//     const signOutButton = document.getElementById('signOutButton');
//     const userNameDisplay = document.getElementById('userNameDisplay');
//     const userBadge = document.getElementById('userBadge');

//     // Check if elements exist (they might not be on all pages)
//     if (!signInOption) {
//         console.log('Dropdown elements not found on this page');
//         return;
//     }

//     if (isSignedIn) {
//         console.log('Showing signed-in options');
//         // User is signed in - show profile and sign out options
//         signInOption.classList.add('d-none');
//         signUpOption.classList.add('d-none');
//         profileOption.classList.remove('d-none');
//         signOutOption.classList.remove('d-none');
//         signOutButton.classList.remove('d-none');

//         if (userName && userNameDisplay) {
//             userNameDisplay.textContent = 'Welcome, ' + userName + '!';
//             userNameDisplay.classList.remove('d-none');
//         }

//         // Update badge to show user is signed in
//         if (userBadge) {
//             userBadge.classList.add('bg-success');
//             userBadge.classList.remove('bg-light', 'text-dark');
//             userBadge.classList.add('text-white');
//             userBadge.textContent = '●';
//         }
//     } else {
//         console.log('Showing signed-out options');
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
//             userBadge.classList.remove('bg-success', 'text-white');
//             userBadge.classList.add('bg-light', 'text-dark');
//             userBadge.textContent = '+99';
//         }
//     }
// }

// // Check user status when page loads
// window.addEventListener('DOMContentLoaded', function() {
//     console.log('Page loaded, checking for dropdown...'); // Debug log
//     if (document.getElementById('userDropdown')) {
//         console.log('Dropdown found, checking user status...'); // Debug log
//         // Small delay to ensure page is fully loaded
//         setTimeout(checkUserSignInStatus, 100);
//     } else {
//         console.log('No dropdown found on this page'); // Debug log
//     }
// });

// // Also check when the page becomes visible (for browser back/forward navigation)
// document.addEventListener('visibilitychange', function() {
//     if (!document.hidden && document.getElementById('userDropdown')) {
//         checkUserSignInStatus();
//     }
// });

const BASE_URL = "http://localhost:8080/Zay1";

function showResult(elementId, content, type = 'info') {
    const element = document.getElementById(elementId);
    const alertClass = type === 'success' ? 'alert-success' :
        type === 'error' ? 'alert-danger' :
            type === 'warning' ? 'alert-warning' : 'alert-info';
}

function showLoading(elementId) {
    document.getElementById(elementId).innerHTML =
        '<div class="text-center"><div class="spinner-border" role="status"></div><br>Loading...</div>';
}

async function testSignIn() {
    showResult('quickTestResult', 'Testing basic connectivity...', 'info');

    try {
        const response = await fetch(`${BASE_URL}/CheckSession`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            showResult('quickTestResult',
                `✅ Server connection OK<br>
                         Status: ${data.isSignedIn ? 'SIGNED IN' : 'NOT SIGNED IN'}<br>
                         Debug: ${data.debug || 'No debug info'}<br>
                         <code>${JSON.stringify(data, null, 2)}</code>`,
                data.isSignedIn ? 'success' : 'warning'
            );
        } else {
            showResult('quickTestResult', `❌ Server Error: ${response.status}`, 'error');
        }
    } catch (error) {
        showResult('quickTestResult', `❌ Network Error: ${error.message}`, 'error');
    }
}

async function checkSession() {
    showLoading('quickTestResult');
    await testSignIn();
}

function checkCookies() {
    const cookies = document.cookie.split(';').filter(c => c.trim());
    const jsessionCookie = cookies.find(c => c.trim().startsWith('JSESSIONID'));

    if (cookies.length === 0) {
        showResult('quickTestResult', '❌ No cookies found!', 'error');
    } else {
        const cookieList = cookies.map(c => `<li><code>${c.trim()}</code></li>`).join('');
        showResult('quickTestResult',
            `🍪 Cookies found:<ul>${cookieList}</ul>
                     ${jsessionCookie ? '✅ JSESSIONID present' : '❌ No JSESSIONID cookie'}`,
            jsessionCookie ? 'success' : 'warning'
        );
    }
}

async function performSignIn() {
    const email = document.getElementById('testEmail').value;
    const password = document.getElementById('testPassword').value;

    if (!email || !password) {
        showResult('signInResult', '❌ Please enter both email and password', 'error');
        return;
    }

    showLoading('signInResult');

    try {
        const signInResponse = await fetch(`${BASE_URL}/SignIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (signInResponse.ok) {
            const signInData = await signInResponse.json();

            if (signInData.status) {
                showResult('signInResult', '✅ Sign in successful! Now checking session...', 'success');

                // Wait a moment, then check session
                setTimeout(async () => {
                    const sessionResponse = await fetch(`${BASE_URL}/CheckSession`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();
                        showResult('signInResult',
                            `✅ Sign in successful!<br>
                                     Session check: ${sessionData.isSignedIn ? 'SUCCESS' : 'FAILED'}<br>
                                     User: ${sessionData.userName}<br>
                                     <details><summary>Full Response</summary><code>${JSON.stringify(sessionData, null, 2)}</code></details>`,
                            sessionData.isSignedIn ? 'success' : 'warning'
                        );
                    }
                }, 500);

            } else {
                showResult('signInResult', `❌ Sign in failed: ${signInData.message}`, 'error');
            }
        } else {
            showResult('signInResult', `❌ Server error: ${signInResponse.status}`, 'error');
        }
    } catch (error) {
        showResult('signInResult', `❌ Network error: ${error.message}`, 'error');
    }
}

async function detailedSessionCheck() {
    showLoading('sessionStatus');

    try {
        const response = await fetch(`${BASE_URL}/CheckSession`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const isSignedIn = data.isSignedIn;

            showResult('sessionStatus',
                `<h4 class="${isSignedIn ? 'status-good' : 'status-bad'}">
                            ${isSignedIn ? '✅ SIGNED IN' : '❌ NOT SIGNED IN'}
                        </h4>
                        <table class="table table-sm">
                            <tr><td><strong>User Name:</strong></td><td>${data.userName || 'N/A'}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>${data.userEmail || 'N/A'}</td></tr>
                            <tr><td><strong>Session ID:</strong></td><td>${data.sessionId || 'N/A'}</td></tr>
                            <tr><td><strong>Debug Info:</strong></td><td>${data.debug || 'N/A'}</td></tr>
                            <tr><td><strong>Server Time:</strong></td><td>${data.serverTime || 'N/A'}</td></tr>
                        </table>
                        <details><summary>Raw Response</summary>
                            <div class="code-block">${JSON.stringify(data, null, 2)}</div>
                        </details>`,
                isSignedIn ? 'success' : 'warning'
            );
        } else {
            showResult('sessionStatus', `❌ Server Error: ${response.status}`, 'error');
        }
    } catch (error) {
        showResult('sessionStatus', `❌ Network Error: ${error.message}`, 'error');
    }
}

function showBrowserInfo() {
    const info = {
        'User Agent': navigator.userAgent,
        'Cookies Enabled': navigator.cookieEnabled,
        'Language': navigator.language,
        'Platform': navigator.platform,
        'Current URL': window.location.href,
        'Document Domain': document.domain,
        'All Cookies': document.cookie || 'None'
    };

    const infoTable = Object.entries(info).map(([key, value]) =>
        `<tr><td><strong>${key}:</strong></td><td><code>${value}</code></td></tr>`
    ).join('');

    document.getElementById('browserInfo').innerHTML =
        `<div class="mt-3"><table class="table table-sm">${infoTable}</table></div>`;
}

// Auto-run basic test on page load
window.addEventListener('DOMContentLoaded', function () {
    testSignIn();
});