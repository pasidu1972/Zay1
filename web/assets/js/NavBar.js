
const CONFIG = {
    baseUrl: 'http://localhost:8080/Zay1',
    checkSessionEndpoint: '/CheckSession',
    signOutEndpoint: '/SignOut'
};

function debugLog(message, data = null) {
    console.log(`[NavAuth] ${message}`, data || '');
}


async function checkUserAuthStatus() {
    debugLog('Checking user authentication status...');
    
    try {
        const response = await fetch(CONFIG.baseUrl + CONFIG.checkSessionEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for session cookies
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        debugLog('Server response received:', data);
        
        // Update the navbar based on authentication status
        updateNavbarAuth(data.isSignedIn, data.userName, data.userEmail);
        
        return data;
        
    } catch (error) {
        debugLog('Error checking authentication status:', error.message);
        // Default to not signed in on error
        updateNavbarAuth(false, '', '');
        return null;
    }
}

/**
 * Update the navigation bar based on authentication status
 */
function updateNavbarAuth(isSignedIn, userName, userEmail) {
    debugLog(`Updating navbar - Signed in: ${isSignedIn}, User: ${userName}`);
    
    // Get DOM elements
    const elements = {
        signInOption: document.getElementById('signInOption'),
        signUpOption: document.getElementById('signUpOption'),
        profileOption: document.getElementById('profileOption'),
        signOutOption: document.getElementById('signOutOption'),
        signOutButton: document.getElementById('signOutButton'),
        userNameDisplay: document.getElementById('userNameDisplay'),
        userBadge: document.getElementById('userBadge')
    };
    
    // Check if we're on a page that has the dropdown
    if (!elements.signInOption) {
        debugLog('Navigation dropdown not found on this page');
        return;
    }
    
    // Ensure we have a valid user name if signed in
    const validSignIn = isSignedIn && userName && userName.trim() !== '';
    
    if (validSignIn) {
        debugLog('Showing authenticated user options');
        
        // Hide sign-in/sign-up options
        elements.signInOption?.classList.add('d-none');
        elements.signUpOption?.classList.add('d-none');
        
        // Show authenticated user options
        elements.profileOption?.classList.remove('d-none');
        elements.signOutOption?.classList.remove('d-none');
        elements.signOutButton?.classList.remove('d-none');
        
        // Update welcome message
        if (elements.userNameDisplay) {
            elements.userNameDisplay.textContent = `Welcome, ${userName}!`;
            elements.userNameDisplay.classList.remove('d-none');
        }
        
        // Update user badge to show online status
        if (elements.userBadge) {
            elements.userBadge.classList.remove('bg-light', 'text-dark');
            elements.userBadge.classList.add('bg-success', 'text-white');
            elements.userBadge.textContent = '●'; // Online indicator
            elements.userBadge.title = 'Signed in';
        }
        
    } else {
        debugLog('Showing guest user options');
        
        // Show sign-in/sign-up options
        elements.signInOption?.classList.remove('d-none');
        elements.signUpOption?.classList.remove('d-none');
        
        // Hide authenticated user options
        elements.profileOption?.classList.add('d-none');
        elements.signOutOption?.classList.add('d-none');
        elements.signOutButton?.classList.add('d-none');
        
        // Hide welcome message
        if (elements.userNameDisplay) {
            elements.userNameDisplay.classList.add('d-none');
        }
        
        // Update user badge to show guest status
        if (elements.userBadge) {
            elements.userBadge.classList.remove('bg-success', 'text-white');
            elements.userBadge.classList.add('bg-light', 'text-dark');
            elements.userBadge.textContent = '+99'; // Guest indicator
            elements.userBadge.title = 'Guest user';
        }
    }
}

/**
 * Handle user sign out
 */
async function handleSignOut() {
    // Confirm sign out
    if (!confirm('Are you sure you want to sign out?')) {
        return;
    }
    
    debugLog('Initiating sign out...');
    
    try {
        const response = await fetch(CONFIG.baseUrl + CONFIG.signOutEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        debugLog('Sign out response:', data);
        
        if (data.status) {
            debugLog('Sign out successful');
            
            // Update navbar to guest state
            updateNavbarAuth(false, '', '');
            
            // Show success message
            alert('You have been signed out successfully!');
            
            // Redirect to home page
            window.location.href = 'index.html';
            
        } else {
            throw new Error(data.message || 'Sign out failed');
        }
        
    } catch (error) {
        debugLog('Sign out error:', error.message);
        alert('Error signing out. Please try again.');
    }
}

/**
 * Initialize authentication checking when page loads
 */
function initializeNavbarAuth() {
    debugLog('Initializing navbar authentication...');
    
    // Check if we have the dropdown on this page
    const dropdown = document.getElementById('userDropdown');
    if (!dropdown) {
        debugLog('User dropdown not found on this page');
        return;
    }
    
    // Initial authentication check
    checkUserAuthStatus();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Check auth status when page becomes visible (handles browser back/forward)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && document.getElementById('userDropdown')) {
            debugLog('Page visibility changed, rechecking auth status...');
            checkUserAuthStatus();
        }
    });
    
    // Periodically check auth status (every 5 minutes)
    setInterval(function() {
        if (document.getElementById('userDropdown')) {
            debugLog('Periodic auth status check...');
            checkUserAuthStatus();
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM loaded, initializing navbar authentication...');
    
    // Small delay to ensure all elements are rendered
    setTimeout(function() {
        initializeNavbarAuth();
        setupEventListeners();
    }, 100);
});

// Also check when window loads (backup)
window.addEventListener('load', function() {
    debugLog('Window loaded, checking navbar auth...');
    
    // Only run if not already initialized
    setTimeout(function() {
        if (document.getElementById('userDropdown')) {
            checkUserAuthStatus();
        }
    }, 200);
});

// Make signOut function globally available for onclick handlers
window.signOut = handleSignOut;

// Export functions for potential external use
window.NavAuth = {
    checkStatus: checkUserAuthStatus,
    signOut: handleSignOut,
    updateNavbar: updateNavbarAuth
};