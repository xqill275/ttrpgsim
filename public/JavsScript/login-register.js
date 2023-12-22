
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginText = document.getElementById('loginText');
const registerText = document.getElementById('registerText');
const hasAccount = document.getElementById('hasAccount');
const noAccount = document.getElementById('noAccount');

loginForm.style.display = 'block';
registerForm.style.display = 'none';
loginText.style.display = 'block';
registerText.style.display = 'none';
hasAccount.style.display = 'none';
noAccount.style.display = 'block';
function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginText = document.getElementById('loginText');
    const registerText = document.getElementById('registerText');
    const hasAccount = document.getElementById('hasAccount');
    const noAccount = document.getElementById('noAccount');

    if (formType === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginText.style.display = 'none';
        registerText.style.display = 'block';
        hasAccount.style.display = 'block';
        noAccount.style.display = 'none';

    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginText.style.display = 'block';
        registerText.style.display = 'none';
        hasAccount.style.display = 'none';
        noAccount.style.display = 'block';
    }
}


document.getElementById('registerPassword').addEventListener('input', function () {
    const password = this.value;
    const strengthText = document.getElementById('strengthText');

    // Add your custom password strength logic here
    const strength = calculatePasswordStrength(password);

    // Update the password strength text
    strengthText.textContent = getStrengthText(strength);
});

function calculatePasswordStrength(password) {
    var lowercase_score = 2;
    var uppercase_score = 4;
    var number_score = 6;
    var special_score = 8;
    var length_score = 2;
    var total_score = 0;

    // Loop through each character in the password
    for (var i = 0; i < password.length; i++) {
        var char = password[i];

        // Check the type of character and add the corresponding score
        if (/[a-z]/.test(char)) {
            total_score += lowercase_score;
        } else if (/[A-Z]/.test(char)) {
            total_score += uppercase_score;
        } else if (/\d/.test(char)) {
            total_score += number_score;
        } else if (/[^a-zA-Z\d]/.test(char)) {
            total_score += special_score;
        }
    }

    // Add length score
    total_score += length_score * password.length;

    // Cap the total score at a maximum value (adjust as needed)
    var max_score = 100;
    total_score = Math.min(max_score, total_score);

    return total_score;
}

function getStrengthText(strength) {
    // Add your custom text based on the password strength value
    if (strength >= 80) {
        return 'Strong';
    } else if (strength >= 40) {
        return 'Medium';
    } else {
        return 'Weak';
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        event.preventDefault();
    }else{
        // submit form as normal




    }
}