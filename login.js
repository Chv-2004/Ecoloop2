document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const userLoginForm = document.getElementById('userLoginForm');
    const signupForm = document.getElementById('signupForm');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const adminUsername = document.getElementById('adminUsername').value;
            const adminPassword = document.getElementById('adminPassword').value;

            // The adminLogin function is in script.js and handles alerts/redirection
            adminLogin(adminUsername, adminPassword);
        });
    }

    if (userLoginForm) {
        userLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('userEmail').value;
            const password = document.getElementById('userPassword').value;
            const rememberMe = document.getElementById('rememberUser').checked;

            // The loginUser function is in script.js
            const user = loginUser(email, password, rememberMe);
            if (user) {
                showToast(`Welcome back, ${user.name}!`, 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showToast('Invalid email or password. Please try again.', 'error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match. Please try again.', 'error');
                return;
            }

            // The registerUser function is in script.js
            if (registerUser(name, email, password)) {
                showToast('Account created! Please log in.', 'success');
                showLoginForm(); // Switch to the login form
            } else {
                showToast('An account with this email already exists.', 'error');
            }
        });
    }
});

function switchLoginType(type) {
    const userForm = document.getElementById('userLoginForm');
    const adminForm = document.getElementById('adminLoginForm');
    const signupForm = document.getElementById('signupForm');
    const userBtn = document.querySelector('.type-btn[onclick*="user"]');
    const adminBtn = document.querySelector('.type-btn[onclick*="admin"]');

    signupForm.classList.remove('active'); // Ensure signup form is hidden

    if (type === 'user') {
        userForm.classList.add('active');
        adminForm.classList.remove('active');
        userBtn.classList.add('active');
        adminBtn.classList.remove('active');
    } else if (type === 'admin') {
        userForm.classList.remove('active');
        adminForm.classList.add('active');
        userBtn.classList.remove('active');
        adminBtn.classList.add('active');
    }
}

function showLoginForm() {
    document.querySelector('.login-type-selector').style.display = 'flex';
    document.getElementById('signupForm').classList.remove('active');
    switchLoginType('user'); // Default to user login view
}

function showSignupForm() {
    document.querySelector('.login-type-selector').style.display = 'none';
    document.getElementById('userLoginForm').classList.remove('active');
    document.getElementById('adminLoginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling; // Assumes icon is the next sibling in the HTML

    if (input && icon) {
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    }
}